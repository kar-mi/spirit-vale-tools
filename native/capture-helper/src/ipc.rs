use std::io::{self, Write};

use crate::packet::TcpPacket;

pub const MAGIC: [u8; 4] = *b"SVCP";
pub const PROTOCOL_VERSION: u16 = 1;
pub const HEADER_LEN: usize = 12;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum RecordType {
    Ready = 1,
    Packet = 2,
    Warning = 3,
    Error = 4,
    Stopped = 5,
}

pub struct FrameWriter<W: Write> {
    output: W,
}

impl<W: Write> FrameWriter<W> {
    pub const fn new(output: W) -> Self {
        Self { output }
    }

    /// Writes a ready record.
    ///
    /// # Errors
    /// Returns an I/O error when stdout cannot be written or flushed.
    pub fn ready(&mut self) -> io::Result<()> {
        self.write_record(RecordType::Ready, &[])
    }

    /// Writes a stopped record.
    ///
    /// # Errors
    /// Returns an I/O error when stdout cannot be written or flushed.
    pub fn stopped(&mut self) -> io::Result<()> {
        self.write_record(RecordType::Stopped, &[])
    }

    /// Writes a UTF-8 warning record.
    ///
    /// # Errors
    /// Returns an I/O error when stdout cannot be written or flushed.
    pub fn warning(&mut self, message: &str) -> io::Result<()> {
        self.write_record(RecordType::Warning, message.as_bytes())
    }

    /// Writes a UTF-8 error record.
    ///
    /// # Errors
    /// Returns an I/O error when stdout cannot be written or flushed.
    pub fn error(&mut self, message: &str) -> io::Result<()> {
        self.write_record(RecordType::Error, message.as_bytes())
    }

    /// Writes a normalized TCP packet record.
    ///
    /// # Errors
    /// Returns an error when the payload exceeds the protocol limit or stdout
    /// cannot be written or flushed.
    pub fn packet(&mut self, packet: &TcpPacket<'_>) -> io::Result<()> {
        let payload_len = u32::try_from(packet.payload.len()).map_err(|_| {
            io::Error::new(io::ErrorKind::InvalidData, "packet payload is too large")
        })?;
        let mut body = Vec::with_capacity(68 + packet.payload.len());
        body.extend_from_slice(&packet.timestamp_ticks.to_le_bytes());
        body.extend_from_slice(&packet.interface_index.to_le_bytes());
        body.extend_from_slice(&packet.subinterface_index.to_le_bytes());
        body.push(u8::from(packet.outbound));
        body.push(packet.ip_version);
        body.push(packet.tcp_flags);
        body.push(u8::from(packet.truncated) | (u8::from(packet.loopback) << 1));
        body.extend_from_slice(&packet.source_ip);
        body.extend_from_slice(&packet.destination_ip);
        body.extend_from_slice(&packet.source_port.to_le_bytes());
        body.extend_from_slice(&packet.destination_port.to_le_bytes());
        body.extend_from_slice(&packet.sequence_number.to_le_bytes());
        body.extend_from_slice(&packet.acknowledgement_number.to_le_bytes());
        body.extend_from_slice(&payload_len.to_le_bytes());
        body.extend_from_slice(packet.payload);
        self.write_record(RecordType::Packet, &body)
    }

    fn write_record(&mut self, record_type: RecordType, body: &[u8]) -> io::Result<()> {
        let body_len = u32::try_from(body.len())
            .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "record is too large"))?;
        let mut header = [0_u8; HEADER_LEN];
        header[0..4].copy_from_slice(&MAGIC);
        header[4..6].copy_from_slice(&PROTOCOL_VERSION.to_le_bytes());
        header[6] = record_type as u8;
        header[8..12].copy_from_slice(&body_len.to_le_bytes());
        self.output.write_all(&header)?;
        self.output.write_all(body)?;
        self.output.flush()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn writes_versioned_ready_frame() {
        let mut bytes = Vec::new();
        FrameWriter::new(&mut bytes).ready().unwrap();
        assert_eq!(&bytes[0..4], b"SVCP");
        assert_eq!(u16::from_le_bytes(bytes[4..6].try_into().unwrap()), 1);
        assert_eq!(bytes[6], RecordType::Ready as u8);
        assert_eq!(u32::from_le_bytes(bytes[8..12].try_into().unwrap()), 0);
    }

    #[test]
    fn encodes_packet_payload_without_referencing_source_buffer() {
        let payload = [1, 2, 3, 4];
        let packet = TcpPacket {
            timestamp_ticks: 42,
            interface_index: 3,
            subinterface_index: 4,
            outbound: true,
            loopback: false,
            ip_version: 4,
            source_ip: [0; 16],
            destination_ip: [1; 16],
            source_port: 1234,
            destination_port: 443,
            sequence_number: 5,
            acknowledgement_number: 6,
            tcp_flags: 0x18,
            truncated: false,
            payload: &payload,
        };
        let mut bytes = Vec::new();
        FrameWriter::new(&mut bytes).packet(&packet).unwrap();
        assert_eq!(u32::from_le_bytes(bytes[8..12].try_into().unwrap()), 72);
        assert_eq!(&bytes[12 + 68..], &payload);
    }
}
