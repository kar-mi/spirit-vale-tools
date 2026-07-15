use std::collections::{BTreeSet, HashSet, VecDeque};
use std::time::{Duration, Instant};

use crate::packet::{TransportPacket, TransportProtocol};

const MAX_PENDING_PACKETS: usize = 4096;
const PENDING_PACKET_TTL: Duration = Duration::from_secs(1);

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Endpoint {
    pub ip_version: u8,
    pub address: [u8; 16],
    pub port: u16,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct TcpFlow {
    pub local: Endpoint,
    pub remote: Endpoint,
}

#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct TargetSnapshot {
    pub generation: u64,
    pub process_ids: BTreeSet<u32>,
    pub tcp_flows: HashSet<TcpFlow>,
    pub udp_endpoints: HashSet<Endpoint>,
}

impl TargetSnapshot {
    #[must_use]
    pub fn matches(&self, packet: &TransportPacket) -> bool {
        let metadata = packet.metadata();
        let source = Endpoint {
            ip_version: metadata.ip_version,
            address: metadata.source_ip,
            port: metadata.source_port,
        };
        let destination = Endpoint {
            ip_version: metadata.ip_version,
            address: metadata.destination_ip,
            port: metadata.destination_port,
        };
        let (local, remote) = if metadata.outbound {
            (source, destination)
        } else {
            (destination, source)
        };
        match packet.protocol() {
            TransportProtocol::Tcp => self.tcp_flows.contains(&TcpFlow { local, remote }),
            TransportProtocol::Udp => self.udp_endpoints.iter().any(|endpoint| {
                endpoint.ip_version == local.ip_version
                    && endpoint.port == local.port
                    && (endpoint.address == local.address || endpoint.address == [0; 16])
            }),
        }
    }
}

pub struct AttributionBuffer {
    pending: VecDeque<(Instant, TransportPacket)>,
}

impl AttributionBuffer {
    #[must_use]
    pub const fn new() -> Self {
        Self {
            pending: VecDeque::new(),
        }
    }

    pub fn push(&mut self, packet: TransportPacket, now: Instant) {
        self.expire(now);
        if self.pending.len() == MAX_PENDING_PACKETS {
            self.pending.pop_front();
        }
        self.pending.push_back((now, packet));
    }

    #[must_use]
    pub fn drain_matches(
        &mut self,
        snapshot: &TargetSnapshot,
        now: Instant,
    ) -> Vec<TransportPacket> {
        self.expire(now);
        let mut matches = Vec::new();
        self.pending.retain(|(_, packet)| {
            if snapshot.matches(packet) {
                matches.push(packet.clone());
                false
            } else {
                true
            }
        });
        matches
    }

    fn expire(&mut self, now: Instant) {
        while self
            .pending
            .front()
            .is_some_and(|(captured, _)| now.duration_since(*captured) > PENDING_PACKET_TTL)
        {
            self.pending.pop_front();
        }
    }
}

impl Default for AttributionBuffer {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(target_os = "windows")]
pub mod windows {
    use std::ffi::c_void;
    use std::io;
    use std::mem::{size_of, size_of_val};
    use std::ptr;

    use windows_sys::Win32::Foundation::{
        CloseHandle, ERROR_INSUFFICIENT_BUFFER, INVALID_HANDLE_VALUE,
    };
    use windows_sys::Win32::NetworkManagement::IpHelper::{
        GetExtendedTcpTable, GetExtendedUdpTable, MIB_TCP6ROW_OWNER_PID, MIB_TCPROW_OWNER_PID,
        MIB_UDP6ROW_OWNER_PID, MIB_UDPROW_OWNER_PID, TCP_TABLE_OWNER_PID_ALL, UDP_TABLE_OWNER_PID,
    };
    use windows_sys::Win32::Networking::WinSock::{AF_INET, AF_INET6};
    use windows_sys::Win32::System::Diagnostics::ToolHelp::{
        CreateToolhelp32Snapshot, PROCESSENTRY32W, Process32FirstW, Process32NextW,
        TH32CS_SNAPPROCESS,
    };

    use super::{Endpoint, TargetSnapshot, TcpFlow};

    /// Takes a point-in-time snapshot of matching processes and their owned endpoints.
    ///
    /// # Errors
    /// Returns an operating-system error when process or IP Helper tables cannot be read.
    pub fn refresh(process_name: &str, generation: u64) -> io::Result<TargetSnapshot> {
        let process_ids = process_ids(process_name)?;
        let mut snapshot = TargetSnapshot {
            generation,
            process_ids,
            ..TargetSnapshot::default()
        };
        if snapshot.process_ids.is_empty() {
            return Ok(snapshot);
        }
        collect_tcp::<MIB_TCPROW_OWNER_PID>(&mut snapshot, AF_INET)?;
        collect_tcp::<MIB_TCP6ROW_OWNER_PID>(&mut snapshot, AF_INET6)?;
        collect_udp::<MIB_UDPROW_OWNER_PID>(&mut snapshot, AF_INET)?;
        collect_udp::<MIB_UDP6ROW_OWNER_PID>(&mut snapshot, AF_INET6)?;
        Ok(snapshot)
    }

    fn process_ids(process_name: &str) -> io::Result<std::collections::BTreeSet<u32>> {
        // SAFETY: Tool Help returns an owned snapshot handle, closed below.
        let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };
        if snapshot == INVALID_HANDLE_VALUE {
            return Err(io::Error::last_os_error());
        }
        let mut entry = PROCESSENTRY32W {
            dwSize: u32::try_from(size_of::<PROCESSENTRY32W>())
                .expect("PROCESSENTRY32W size fits u32"),
            ..Default::default()
        };
        let mut ids = std::collections::BTreeSet::new();
        // SAFETY: `entry` has the required size and remains valid for each call.
        let mut found = unsafe { Process32FirstW(snapshot, &raw mut entry) } != 0;
        while found {
            let end = entry
                .szExeFile
                .iter()
                .position(|character| *character == 0)
                .unwrap_or(entry.szExeFile.len());
            let name = String::from_utf16_lossy(&entry.szExeFile[..end]);
            if name.eq_ignore_ascii_case(process_name) {
                ids.insert(entry.th32ProcessID);
            }
            // SAFETY: snapshot and entry remain valid.
            found = unsafe { Process32NextW(snapshot, &raw mut entry) } != 0;
        }
        // SAFETY: snapshot is a valid owned handle and is closed exactly once.
        unsafe { CloseHandle(snapshot) };
        Ok(ids)
    }

    trait TcpOwnerRow: Copy {
        fn owner_pid(self) -> u32;
        fn flow(self) -> TcpFlow;
    }

    impl TcpOwnerRow for MIB_TCPROW_OWNER_PID {
        fn owner_pid(self) -> u32 {
            self.dwOwningPid
        }
        fn flow(self) -> TcpFlow {
            TcpFlow {
                local: endpoint_v4(self.dwLocalAddr, self.dwLocalPort),
                remote: endpoint_v4(self.dwRemoteAddr, self.dwRemotePort),
            }
        }
    }

    impl TcpOwnerRow for MIB_TCP6ROW_OWNER_PID {
        fn owner_pid(self) -> u32 {
            self.dwOwningPid
        }
        fn flow(self) -> TcpFlow {
            TcpFlow {
                local: Endpoint {
                    ip_version: 6,
                    address: self.ucLocalAddr,
                    port: port(self.dwLocalPort),
                },
                remote: Endpoint {
                    ip_version: 6,
                    address: self.ucRemoteAddr,
                    port: port(self.dwRemotePort),
                },
            }
        }
    }

    trait UdpOwnerRow: Copy {
        fn owner_pid(self) -> u32;
        fn endpoint(self) -> Endpoint;
    }

    impl UdpOwnerRow for MIB_UDPROW_OWNER_PID {
        fn owner_pid(self) -> u32 {
            self.dwOwningPid
        }
        fn endpoint(self) -> Endpoint {
            endpoint_v4(self.dwLocalAddr, self.dwLocalPort)
        }
    }

    impl UdpOwnerRow for MIB_UDP6ROW_OWNER_PID {
        fn owner_pid(self) -> u32 {
            self.dwOwningPid
        }
        fn endpoint(self) -> Endpoint {
            Endpoint {
                ip_version: 6,
                address: self.ucLocalAddr,
                port: port(self.dwLocalPort),
            }
        }
    }

    fn collect_tcp<T: TcpOwnerRow>(snapshot: &mut TargetSnapshot, family: u16) -> io::Result<()> {
        let buffer = table_buffer(|table, size| {
            // SAFETY: the IP Helper API writes no more than `size` bytes to `table`.
            unsafe {
                GetExtendedTcpTable(
                    table,
                    size,
                    0,
                    u32::from(family),
                    TCP_TABLE_OWNER_PID_ALL,
                    0,
                )
            }
        })?;
        for row in rows::<T>(&buffer) {
            if snapshot.process_ids.contains(&row.owner_pid()) {
                snapshot.tcp_flows.insert(row.flow());
            }
        }
        Ok(())
    }

    fn collect_udp<T: UdpOwnerRow>(snapshot: &mut TargetSnapshot, family: u16) -> io::Result<()> {
        let buffer = table_buffer(|table, size| {
            // SAFETY: the IP Helper API writes no more than `size` bytes to `table`.
            unsafe {
                GetExtendedUdpTable(table, size, 0, u32::from(family), UDP_TABLE_OWNER_PID, 0)
            }
        })?;
        for row in rows::<T>(&buffer) {
            if snapshot.process_ids.contains(&row.owner_pid()) {
                snapshot.udp_endpoints.insert(row.endpoint());
            }
        }
        Ok(())
    }

    fn table_buffer(call: impl Fn(*mut c_void, *mut u32) -> u32) -> io::Result<Vec<u32>> {
        let mut byte_len = 0_u32;
        let first = call(ptr::null_mut(), &raw mut byte_len);
        if first != ERROR_INSUFFICIENT_BUFFER && first != 0 {
            return Err(io::Error::from_raw_os_error(first.cast_signed()));
        }
        let words = usize::try_from(byte_len)
            .unwrap_or(usize::MAX)
            .div_ceil(size_of::<u32>());
        let mut buffer = vec![0_u32; words.max(1)];
        let result = call(buffer.as_mut_ptr().cast(), &raw mut byte_len);
        if result != 0 {
            return Err(io::Error::from_raw_os_error(result.cast_signed()));
        }
        Ok(buffer)
    }

    fn rows<T: Copy>(buffer: &[u32]) -> Vec<T> {
        if size_of_val(buffer) < size_of::<u32>() {
            return Vec::new();
        }
        let count = usize::try_from(buffer[0]).unwrap_or(0);
        let available = (size_of_val(buffer) - size_of::<u32>()) / size_of::<T>();
        let count = count.min(available);
        let start = buffer.as_ptr().cast::<u8>();
        (0..count)
            .map(|index| {
                // SAFETY: count is bounded by the allocated buffer; read_unaligned handles table layout.
                unsafe {
                    ptr::read_unaligned(start.add(size_of::<u32>() + index * size_of::<T>()).cast())
                }
            })
            .collect()
    }

    fn endpoint_v4(address: u32, encoded_port: u32) -> Endpoint {
        let mut bytes = [0_u8; 16];
        bytes[12..].copy_from_slice(&address.to_ne_bytes());
        Endpoint {
            ip_version: 4,
            address: bytes,
            port: port(encoded_port),
        }
    }

    fn port(encoded: u32) -> u16 {
        let bytes = encoded.to_ne_bytes();
        u16::from_be_bytes([bytes[0], bytes[1]])
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::packet::{PacketMetadata, TcpPacket, TransportPacket, UdpPacket};

    fn udp(outbound: bool) -> TransportPacket {
        let mut source = [0; 16];
        source[12..].copy_from_slice(&[10, 0, 0, 1]);
        let mut destination = [0; 16];
        destination[12..].copy_from_slice(&[8, 8, 8, 8]);
        TransportPacket::Udp(UdpPacket {
            metadata: PacketMetadata {
                timestamp_ticks: 0,
                interface_index: 0,
                subinterface_index: 0,
                outbound,
                loopback: false,
                ip_version: 4,
                source_ip: source,
                destination_ip: destination,
                source_port: 5000,
                destination_port: 53,
                truncated: false,
            },
            payload: vec![],
        })
    }

    #[test]
    fn matches_udp_local_endpoint_in_both_directions() {
        let mut snapshot = TargetSnapshot::default();
        snapshot.udp_endpoints.insert(Endpoint {
            ip_version: 4,
            address: [0; 16],
            port: 5000,
        });
        assert!(snapshot.matches(&udp(true)));
        let mut inbound = udp(false);
        let metadata = match &mut inbound {
            TransportPacket::Udp(packet) => &mut packet.metadata,
            TransportPacket::Tcp(_) => unreachable!(),
        };
        std::mem::swap(&mut metadata.source_ip, &mut metadata.destination_ip);
        std::mem::swap(&mut metadata.source_port, &mut metadata.destination_port);
        assert!(snapshot.matches(&inbound));
    }

    #[test]
    fn matches_tcp_directional_flow() {
        let packet = udp(true);
        let metadata = packet.metadata().clone();
        let local = Endpoint {
            ip_version: 4,
            address: metadata.source_ip,
            port: metadata.source_port,
        };
        let remote = Endpoint {
            ip_version: 4,
            address: metadata.destination_ip,
            port: metadata.destination_port,
        };
        let tcp = TransportPacket::Tcp(TcpPacket {
            metadata,
            sequence_number: 1,
            acknowledgement_number: 0,
            tcp_flags: 2,
            payload: Vec::new(),
        });
        let mut snapshot = TargetSnapshot::default();
        snapshot.tcp_flows.insert(TcpFlow { local, remote });
        assert!(snapshot.matches(&tcp));
    }

    #[test]
    fn replays_each_delayed_packet_once() {
        let packet = udp(true);
        let now = Instant::now();
        let mut buffer = AttributionBuffer::new();
        buffer.push(packet, now);
        assert!(
            buffer
                .drain_matches(&TargetSnapshot::default(), now)
                .is_empty()
        );
        let mut snapshot = TargetSnapshot::default();
        snapshot.udp_endpoints.insert(Endpoint {
            ip_version: 4,
            address: [0; 16],
            port: 5000,
        });
        assert_eq!(buffer.drain_matches(&snapshot, now).len(), 1);
        assert!(buffer.drain_matches(&snapshot, now).is_empty());
    }
}
