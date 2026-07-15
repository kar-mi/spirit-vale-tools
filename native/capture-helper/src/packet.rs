#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CaptureMetadata {
    pub timestamp_ticks: i64,
    pub interface_index: u32,
    pub subinterface_index: u32,
    pub outbound: bool,
    pub loopback: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TransportProtocol {
    Tcp,
    Udp,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PacketMetadata {
    pub timestamp_ticks: i64,
    pub interface_index: u32,
    pub subinterface_index: u32,
    pub outbound: bool,
    pub loopback: bool,
    pub ip_version: u8,
    pub source_ip: [u8; 16],
    pub destination_ip: [u8; 16],
    pub source_port: u16,
    pub destination_port: u16,
    pub truncated: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TcpPacket {
    pub metadata: PacketMetadata,
    pub sequence_number: u32,
    pub acknowledgement_number: u32,
    pub tcp_flags: u8,
    pub payload: Vec<u8>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct UdpPacket {
    pub metadata: PacketMetadata,
    pub payload: Vec<u8>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TransportPacket {
    Tcp(TcpPacket),
    Udp(UdpPacket),
}

impl TransportPacket {
    #[must_use]
    pub const fn protocol(&self) -> TransportProtocol {
        match self {
            Self::Tcp(_) => TransportProtocol::Tcp,
            Self::Udp(_) => TransportProtocol::Udp,
        }
    }

    #[must_use]
    pub const fn metadata(&self) -> &PacketMetadata {
        match self {
            Self::Tcp(packet) => &packet.metadata,
            Self::Udp(packet) => &packet.metadata,
        }
    }
}

#[must_use]
pub fn parse_transport_packet(data: &[u8], capture: &CaptureMetadata) -> Option<TransportPacket> {
    match data.first().map(|byte| byte >> 4) {
        Some(4) => parse_ipv4(data, capture),
        Some(6) => parse_ipv6(data, capture),
        _ => None,
    }
}

fn parse_ipv4(data: &[u8], capture: &CaptureMetadata) -> Option<TransportPacket> {
    if data.len() < 20 {
        return None;
    }
    let header_len = usize::from(data[0] & 0x0f) * 4;
    if header_len < 20 || header_len > data.len() {
        return None;
    }
    let fragment = read_u16_be(data, 6)?;
    if fragment & 0x1fff != 0 {
        return None;
    }
    let declared_len = usize::from(read_u16_be(data, 2)?);
    if declared_len < header_len {
        return None;
    }
    let mut source_ip = [0_u8; 16];
    let mut destination_ip = [0_u8; 16];
    source_ip[12..].copy_from_slice(data.get(12..16)?);
    destination_ip[12..].copy_from_slice(data.get(16..20)?);
    parse_transport(
        data,
        header_len,
        declared_len.min(data.len()),
        declared_len > data.len(),
        data[9],
        4,
        source_ip,
        destination_ip,
        capture,
    )
}

fn parse_ipv6(data: &[u8], capture: &CaptureMetadata) -> Option<TransportPacket> {
    if data.len() < 40 {
        return None;
    }
    let declared_len = 40_usize.checked_add(usize::from(read_u16_be(data, 4)?))?;
    let packet_end = declared_len.min(data.len());
    let mut next_header = data[6];
    let mut offset = 40_usize;
    while matches!(next_header, 0 | 43 | 44 | 51 | 60) {
        if offset + 2 > packet_end {
            return None;
        }
        let current = next_header;
        next_header = data[offset];
        let extension_len = match current {
            44 => {
                if offset + 8 > packet_end || read_u16_be(data, offset + 2)? & 0xfff8 != 0 {
                    return None;
                }
                8
            }
            51 => (usize::from(data[offset + 1]) + 2) * 4,
            _ => (usize::from(data[offset + 1]) + 1) * 8,
        };
        offset = offset.checked_add(extension_len)?;
        if offset > packet_end {
            return None;
        }
    }
    let mut source_ip = [0_u8; 16];
    let mut destination_ip = [0_u8; 16];
    source_ip.copy_from_slice(data.get(8..24)?);
    destination_ip.copy_from_slice(data.get(24..40)?);
    parse_transport(
        data,
        offset,
        packet_end,
        declared_len > data.len(),
        next_header,
        6,
        source_ip,
        destination_ip,
        capture,
    )
}

#[allow(clippy::too_many_arguments)]
fn parse_transport(
    data: &[u8],
    offset: usize,
    packet_end: usize,
    truncated: bool,
    protocol: u8,
    ip_version: u8,
    source_ip: [u8; 16],
    destination_ip: [u8; 16],
    capture: &CaptureMetadata,
) -> Option<TransportPacket> {
    match protocol {
        6 => parse_tcp(
            data,
            offset,
            packet_end,
            truncated,
            ip_version,
            source_ip,
            destination_ip,
            capture,
        ),
        17 => parse_udp(
            data,
            offset,
            packet_end,
            truncated,
            ip_version,
            source_ip,
            destination_ip,
            capture,
        ),
        _ => None,
    }
}

#[allow(clippy::too_many_arguments)]
fn packet_metadata(
    data: &[u8],
    offset: usize,
    truncated: bool,
    ip_version: u8,
    source_ip: [u8; 16],
    destination_ip: [u8; 16],
    capture: &CaptureMetadata,
) -> Option<PacketMetadata> {
    Some(PacketMetadata {
        timestamp_ticks: capture.timestamp_ticks,
        interface_index: capture.interface_index,
        subinterface_index: capture.subinterface_index,
        outbound: capture.outbound,
        loopback: capture.loopback,
        ip_version,
        source_ip,
        destination_ip,
        source_port: read_u16_be(data, offset)?,
        destination_port: read_u16_be(data, offset + 2)?,
        truncated,
    })
}

#[allow(clippy::too_many_arguments)]
fn parse_tcp(
    data: &[u8],
    offset: usize,
    packet_end: usize,
    truncated: bool,
    ip_version: u8,
    source_ip: [u8; 16],
    destination_ip: [u8; 16],
    capture: &CaptureMetadata,
) -> Option<TransportPacket> {
    if offset.checked_add(20)? > packet_end {
        return None;
    }
    let header_len = usize::from(data[offset + 12] >> 4) * 4;
    if header_len < 20 || offset.checked_add(header_len)? > packet_end {
        return None;
    }
    Some(TransportPacket::Tcp(TcpPacket {
        metadata: packet_metadata(
            data,
            offset,
            truncated,
            ip_version,
            source_ip,
            destination_ip,
            capture,
        )?,
        sequence_number: read_u32_be(data, offset + 4)?,
        acknowledgement_number: read_u32_be(data, offset + 8)?,
        tcp_flags: data[offset + 13],
        payload: data.get(offset + header_len..packet_end)?.to_vec(),
    }))
}

#[allow(clippy::too_many_arguments)]
fn parse_udp(
    data: &[u8],
    offset: usize,
    packet_end: usize,
    truncated: bool,
    ip_version: u8,
    source_ip: [u8; 16],
    destination_ip: [u8; 16],
    capture: &CaptureMetadata,
) -> Option<TransportPacket> {
    if offset.checked_add(8)? > packet_end {
        return None;
    }
    let udp_len = usize::from(read_u16_be(data, offset + 4)?);
    if udp_len < 8 {
        return None;
    }
    let declared_end = offset.checked_add(udp_len)?;
    let payload_end = declared_end.min(packet_end);
    Some(TransportPacket::Udp(UdpPacket {
        metadata: packet_metadata(
            data,
            offset,
            truncated || declared_end > packet_end,
            ip_version,
            source_ip,
            destination_ip,
            capture,
        )?,
        payload: data.get(offset + 8..payload_end)?.to_vec(),
    }))
}

fn read_u16_be(data: &[u8], offset: usize) -> Option<u16> {
    Some(u16::from_be_bytes(
        data.get(offset..offset + 2)?.try_into().ok()?,
    ))
}

fn read_u32_be(data: &[u8], offset: usize) -> Option<u32> {
    Some(u32::from_be_bytes(
        data.get(offset..offset + 4)?.try_into().ok()?,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn metadata() -> CaptureMetadata {
        CaptureMetadata {
            timestamp_ticks: 99,
            interface_index: 2,
            subinterface_index: 3,
            outbound: true,
            loopback: false,
        }
    }

    fn ipv4(protocol: u8, transport_header_len: usize, payload: &[u8]) -> Vec<u8> {
        let total = 20 + transport_header_len + payload.len();
        let mut packet = vec![0_u8; total];
        packet[0] = 0x45;
        packet[2..4].copy_from_slice(&u16::try_from(total).unwrap().to_be_bytes());
        packet[9] = protocol;
        packet[12..16].copy_from_slice(&[10, 0, 0, 1]);
        packet[16..20].copy_from_slice(&[10, 0, 0, 2]);
        packet[20..22].copy_from_slice(&1234_u16.to_be_bytes());
        packet[22..24].copy_from_slice(&443_u16.to_be_bytes());
        packet[20 + transport_header_len..].copy_from_slice(payload);
        packet
    }

    #[test]
    fn parses_tcp_and_udp_payloads() {
        let mut tcp = ipv4(6, 20, &[1, 2, 3]);
        tcp[24..28].copy_from_slice(&5_u32.to_be_bytes());
        tcp[28..32].copy_from_slice(&6_u32.to_be_bytes());
        tcp[32] = 0x50;
        tcp[33] = 0x18;
        let TransportPacket::Tcp(tcp) = parse_transport_packet(&tcp, &metadata()).unwrap() else {
            panic!()
        };
        assert_eq!(tcp.metadata.destination_port, 443);
        assert_eq!(tcp.sequence_number, 5);
        assert_eq!(tcp.payload, [1, 2, 3]);

        let mut udp = ipv4(17, 8, &[4, 5]);
        udp[24..26].copy_from_slice(&10_u16.to_be_bytes());
        let TransportPacket::Udp(udp) = parse_transport_packet(&udp, &metadata()).unwrap() else {
            panic!()
        };
        assert_eq!(udp.metadata.source_port, 1234);
        assert_eq!(udp.payload, [4, 5]);
    }

    #[test]
    fn marks_truncated_udp() {
        let mut bytes = ipv4(17, 8, &[1, 2, 3]);
        bytes[24..26].copy_from_slice(&20_u16.to_be_bytes());
        let TransportPacket::Udp(packet) = parse_transport_packet(&bytes, &metadata()).unwrap()
        else {
            panic!()
        };
        assert!(packet.metadata.truncated);
        assert_eq!(packet.payload, [1, 2, 3]);
    }

    #[test]
    fn parses_ipv6_udp_with_extension_header() {
        let mut bytes = vec![0_u8; 40 + 8 + 8 + 2];
        bytes[0] = 0x60;
        bytes[4..6].copy_from_slice(&18_u16.to_be_bytes());
        bytes[6] = 0;
        bytes[40] = 17;
        bytes[41] = 0;
        bytes[48..50].copy_from_slice(&80_u16.to_be_bytes());
        bytes[50..52].copy_from_slice(&9000_u16.to_be_bytes());
        bytes[52..54].copy_from_slice(&10_u16.to_be_bytes());
        bytes[56..].copy_from_slice(&[7, 8]);
        let TransportPacket::Udp(packet) = parse_transport_packet(&bytes, &metadata()).unwrap()
        else {
            panic!()
        };
        assert_eq!(packet.metadata.ip_version, 6);
        assert_eq!(packet.payload, [7, 8]);
    }

    #[test]
    fn rejects_fragments_and_unsupported_protocols() {
        let mut bytes = ipv4(6, 20, &[]);
        bytes[6..8].copy_from_slice(&1_u16.to_be_bytes());
        assert!(parse_transport_packet(&bytes, &metadata()).is_none());
        bytes[6..8].fill(0);
        bytes[9] = 1;
        assert!(parse_transport_packet(&bytes, &metadata()).is_none());
    }
}
