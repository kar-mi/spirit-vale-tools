use std::ffi::{CString, c_char, c_void};
use std::io;
use std::path::Path;

use libloading::Library;

use crate::packet::CaptureMetadata;

const WINDIVERT_LAYER_NETWORK: i32 = 0;
const WINDIVERT_FLAG_SNIFF: u64 = 0x0001;
const WINDIVERT_FLAG_RECV_ONLY: u64 = 0x0004;
const WINDIVERT_SHUTDOWN_BOTH: u32 = 0x3;
const WINDIVERT_MTU_MAX: usize = 40 + 0xffff;
const WINDIVERT_MTU_MAX_U32: u32 = 40 + 0xffff;
const INVALID_HANDLE_VALUE: *mut c_void = -1_isize as *mut c_void;

type Handle = *mut c_void;
type OpenFn = unsafe extern "system" fn(*const c_char, i32, i16, u64) -> Handle;
type RecvFn =
    unsafe extern "system" fn(Handle, *mut c_void, u32, *mut u32, *mut WinDivertAddress) -> i32;
pub type ShutdownFn = unsafe extern "system" fn(Handle, u32) -> i32;
type CloseFn = unsafe extern "system" fn(Handle) -> i32;

#[derive(Clone, Copy)]
#[repr(C)]
struct WinDivertAddress {
    timestamp: i64,
    flags: u32,
    reserved2: u32,
    data: [u8; 64],
}

impl Default for WinDivertAddress {
    fn default() -> Self {
        Self {
            timestamp: 0,
            flags: 0,
            reserved2: 0,
            data: [0; 64],
        }
    }
}

pub struct CapturedFrame<'a> {
    pub bytes: &'a [u8],
    pub metadata: CaptureMetadata,
}

pub struct WinDivertCapture {
    handle: Handle,
    recv: RecvFn,
    shutdown: ShutdownFn,
    close: CloseFn,
    buffer: Vec<u8>,
    _library: Library,
}

impl WinDivertCapture {
    /// Loads `WinDivert` and opens a network-layer sniffing handle.
    ///
    /// # Errors
    /// Returns an error when the filter contains a NUL byte, the DLL or required
    /// symbols cannot be loaded, or `WinDivert` rejects the capture request.
    pub fn open(dll_path: &Path, filter: &str) -> io::Result<Self> {
        let filter = CString::new(filter).map_err(|_| {
            io::Error::new(
                io::ErrorKind::InvalidInput,
                "capture filter contains a NUL byte",
            )
        })?;
        // SAFETY: The library remains owned by the returned capture for as long as any
        // resolved symbol can be called. Each symbol type exactly matches WinDivert 2.2.2.
        let (library, open, recv, shutdown, close) = unsafe {
            let library = Library::new(dll_path).map_err(io::Error::other)?;
            let open = *library
                .get::<OpenFn>(b"WinDivertOpen\0")
                .map_err(io::Error::other)?;
            let recv = *library
                .get::<RecvFn>(b"WinDivertRecv\0")
                .map_err(io::Error::other)?;
            let shutdown = *library
                .get::<ShutdownFn>(b"WinDivertShutdown\0")
                .map_err(io::Error::other)?;
            let close = *library
                .get::<CloseFn>(b"WinDivertClose\0")
                .map_err(io::Error::other)?;
            (library, open, recv, shutdown, close)
        };

        // SAFETY: `filter` is a live NUL-terminated C string and all other values are
        // documented WinDivert constants. The returned handle is checked before use.
        let handle = unsafe {
            open(
                filter.as_ptr(),
                WINDIVERT_LAYER_NETWORK,
                0,
                WINDIVERT_FLAG_SNIFF | WINDIVERT_FLAG_RECV_ONLY,
            )
        };
        if handle.is_null() || handle == INVALID_HANDLE_VALUE {
            return Err(io::Error::last_os_error());
        }

        Ok(Self {
            handle,
            recv,
            shutdown,
            close,
            buffer: vec![0; WINDIVERT_MTU_MAX],
            _library: library,
        })
    }

    #[must_use]
    pub fn handle_value(&self) -> usize {
        self.handle as usize
    }

    #[must_use]
    pub fn shutdown_function(&self) -> ShutdownFn {
        self.shutdown
    }

    /// Blocks until `WinDivert` returns one captured frame.
    ///
    /// # Errors
    /// Returns an OS error when capture fails or an invalid-data error if the
    /// driver reports a packet larger than the provided buffer.
    pub fn receive(&mut self) -> io::Result<CapturedFrame<'_>> {
        let mut received = 0_u32;
        let mut address = WinDivertAddress::default();
        // SAFETY: The packet buffer and address are writable for their declared sizes,
        // and the handle is valid until this capture is dropped.
        let success = unsafe {
            (self.recv)(
                self.handle,
                self.buffer.as_mut_ptr().cast(),
                WINDIVERT_MTU_MAX_U32,
                &raw mut received,
                &raw mut address,
            )
        };
        if success == 0 {
            return Err(io::Error::last_os_error());
        }
        let length = usize::try_from(received)
            .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "invalid packet length"))?;
        let bytes = self.buffer.get(..length).ok_or_else(|| {
            io::Error::new(
                io::ErrorKind::InvalidData,
                "WinDivert returned an oversized packet",
            )
        })?;
        let interface_index = u32::from_le_bytes([
            address.data[0],
            address.data[1],
            address.data[2],
            address.data[3],
        ]);
        let subinterface_index = u32::from_le_bytes([
            address.data[4],
            address.data[5],
            address.data[6],
            address.data[7],
        ]);
        Ok(CapturedFrame {
            bytes,
            metadata: CaptureMetadata {
                timestamp_ticks: address.timestamp,
                interface_index,
                subinterface_index,
                outbound: address.flags & (1 << 17) != 0,
                loopback: address.flags & (1 << 18) != 0,
            },
        })
    }
}

impl Drop for WinDivertCapture {
    fn drop(&mut self) {
        // SAFETY: This object uniquely owns the live handle and closes it exactly once.
        unsafe {
            (self.close)(self.handle);
        }
    }
}

/// Unblocks capture by shutting down both directions of a live `WinDivert` handle.
///
/// # Safety
/// The function pointer must come from the same loaded `WinDivert` library as the
/// handle, and both the library and owning capture must remain live for the call.
pub unsafe fn shutdown_handle(shutdown: ShutdownFn, handle_value: usize) {
    // SAFETY: The caller guarantees that the capture owning this handle and the DLL
    // containing `shutdown` remain live until this call completes.
    unsafe {
        shutdown(handle_value as Handle, WINDIVERT_SHUTDOWN_BOTH);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn address_layout_matches_windivert_2_2_2() {
        assert_eq!(size_of::<WinDivertAddress>(), 80);
        assert_eq!(align_of::<WinDivertAddress>(), 8);
    }
}
