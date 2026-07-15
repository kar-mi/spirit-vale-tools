use std::io::{self, Write};

use crate::packet::{PacketMetadata, TcpPacket, TransportPacket, UdpPacket};

pub const MAGIC: [u8; 4] = *b"SVCP";
pub const PROTOCOL_VERSION: u16 = 2;
pub const HEADER_LEN: usize = 12;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum RecordType {
    Ready = 1,
    TcpPacket = 2,
    Warning = 3,
    Error = 4,
    Stopped = 5,
    UdpPacket = 6,
    TargetStatus = 7,
}

pub struct FrameWriter<W: Write> {
    output: W,
}

#[allow(clippy::missing_errors_doc)]
impl<W: Write> FrameWriter<W> {
    pub const fn new(output: W) -> Self {
        Self { output }
    }

    pub fn ready(&mut self) -> io::Result<()> {
        self.write_record(RecordType::Ready, &[])
    }
    pub fn stopped(&mut self) -> io::Result<()> {
        self.write_record(RecordType::Stopped, &[])
    }
    pub fn warning(&mut self, message: &str) -> io::Result<()> {
        self.write_record(RecordType::Warning, message.as_bytes())
    }
    pub fn error(&mut self, message: &str) -> io::Result<()> {
        self.write_record(RecordType::Error, message.as_bytes())
    }

    pub fn packet(&mut self, packet: &TransportPacket) -> io::Result<()> {
        match packet {
            TransportPacket::Tcp(packet) => self.tcp_packet(packet),
            TransportPacket::Udp(packet) => self.udp_packet(packet),
        }
    }

    pub fn tcp_packet(&mut self, packet: &TcpPacket) -> io::Result<()> {
        let mut body = common_packet_body(&packet.metadata, packet.payload.len(), 68)?;
        body[18] = packet.tcp_flags;
        body.extend_from_slice(&packet.sequence_number.to_le_bytes());
        body.extend_from_slice(&packet.acknowledgement_number.to_le_bytes());
        body.extend_from_slice(&u32_len(packet.payload.len(), "packet payload")?.to_le_bytes());
        body.extend_from_slice(&packet.payload);
        self.write_record(RecordType::TcpPacket, &body)
    }

    pub fn udp_packet(&mut self, packet: &UdpPacket) -> io::Result<()> {
        let mut body = common_packet_body(&packet.metadata, packet.payload.len(), 60)?;
        body.extend_from_slice(&u32_len(packet.payload.len(), "packet payload")?.to_le_bytes());
        body.extend_from_slice(&packet.payload);
        self.write_record(RecordType::UdpPacket, &body)
    }

    pub fn target_status(&mut self, process_name: &str, process_ids: &[u32]) -> io::Result<()> {
        let name = process_name.as_bytes();
        let name_len = u16::try_from(name.len()).map_err(|_| {
            io::Error::new(
                io::ErrorKind::InvalidData,
                "target process name is too long",
            )
        })?;
        let pid_count = u16::try_from(process_ids.len())
            .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "too many target processes"))?;
        let mut body = Vec::with_capacity(5 + name.len() + process_ids.len() * 4);
        body.push(u8::from(!process_ids.is_empty()));
        body.extend_from_slice(&name_len.to_le_bytes());
        body.extend_from_slice(&pid_count.to_le_bytes());
        body.extend_from_slice(name);
        for pid in process_ids {
            body.extend_from_slice(&pid.to_le_bytes());
        }
        self.write_record(RecordType::TargetStatus, &body)
    }

    fn write_record(&mut self, record_type: RecordType, body: &[u8]) -> io::Result<()> {
        let body_len = u32_len(body.len(), "record")?;
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

fn common_packet_body(
    metadata: &PacketMetadata,
    payload_len: usize,
    fixed_len: usize,
) -> io::Result<Vec<u8>> {
    let mut body = Vec::with_capacity(fixed_len + payload_len);
    body.extend_from_slice(&metadata.timestamp_ticks.to_le_bytes());
    body.extend_from_slice(&metadata.interface_index.to_le_bytes());
    body.extend_from_slice(&metadata.subinterface_index.to_le_bytes());
    body.push(u8::from(metadata.outbound));
    body.push(metadata.ip_version);
    body.push(0);
    body.push(u8::from(metadata.truncated) | (u8::from(metadata.loopback) << 1));
    body.extend_from_slice(&metadata.source_ip);
    body.extend_from_slice(&metadata.destination_ip);
    body.extend_from_slice(&metadata.source_port.to_le_bytes());
    body.extend_from_slice(&metadata.destination_port.to_le_bytes());
    if body.len() != 56 {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "invalid packet metadata",
        ));
    }
    Ok(body)
}

fn u32_len(value: usize, label: &str) -> io::Result<u32> {
    u32::try_from(value)
        .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, format!("{label} is too large")))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn metadata() -> PacketMetadata {
        PacketMetadata {
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
            truncated: false,
        }
    }

    #[test]
    fn writes_protocol_v2_and_transport_frames() {
        let mut bytes = Vec::new();
        let mut writer = FrameWriter::new(&mut bytes);
        writer.ready().unwrap();
        writer
            .udp_packet(&UdpPacket {
                metadata: metadata(),
                payload: vec![1, 2],
            })
            .unwrap();
        assert_eq!(u16::from_le_bytes(bytes[4..6].try_into().unwrap()), 2);
        assert_eq!(bytes[18], RecordType::UdpPacket as u8);
    }

    #[test]
    fn writes_target_status() {
        let mut bytes = Vec::new();
        FrameWriter::new(&mut bytes)
            .target_status("SpiritVale.exe", &[7, 9])
            .unwrap();
        assert_eq!(bytes[6], RecordType::TargetStatus as u8);
        assert_eq!(bytes[12], 1);
        assert_eq!(u16::from_le_bytes(bytes[13..15].try_into().unwrap()), 14);
    }
}
