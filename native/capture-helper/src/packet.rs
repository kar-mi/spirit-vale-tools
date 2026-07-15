#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CaptureMetadata {
    pub timestamp_ticks: i64,
    pub interface_index: u32,
    pub subinterface_index: u32,
    pub outbound: bool,
    pub loopback: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TcpPacket<'a> {
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
    pub sequence_number: u32,
    pub acknowledgement_number: u32,
    pub tcp_flags: u8,
    pub truncated: bool,
    pub payload: &'a [u8],
}

#[must_use]
pub fn parse_tcp_packet<'a>(data: &'a [u8], metadata: &CaptureMetadata) -> Option<TcpPacket<'a>> {
    match data.first().map(|byte| byte >> 4) {
        Some(4) => parse_ipv4(data, metadata),
        Some(6) => parse_ipv6(data, metadata),
        _ => None,
    }
}

fn parse_ipv4<'a>(data: &'a [u8], metadata: &CaptureMetadata) -> Option<TcpPacket<'a>> {
    if data.len() < 20 {
        return None;
    }
    let header_len = usize::from(data[0] & 0x0f) * 4;
    if header_len < 20 || header_len > data.len() || data[9] != 6 {
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
    let packet_end = declared_len.min(data.len());
    let mut source_ip = [0_u8; 16];
    let mut destination_ip = [0_u8; 16];
    source_ip[12..].copy_from_slice(data.get(12..16)?);
    destination_ip[12..].copy_from_slice(data.get(16..20)?);
    parse_tcp(
        data,
        header_len,
        packet_end,
        declared_len > data.len(),
        4,
        source_ip,
        destination_ip,
        metadata,
    )
}

fn parse_ipv6<'a>(data: &'a [u8], metadata: &CaptureMetadata) -> Option<TcpPacket<'a>> {
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
    if next_header != 6 {
        return None;
    }
    let mut source_ip = [0_u8; 16];
    let mut destination_ip = [0_u8; 16];
    source_ip.copy_from_slice(data.get(8..24)?);
    destination_ip.copy_from_slice(data.get(24..40)?);
    parse_tcp(
        data,
        offset,
        packet_end,
        declared_len > data.len(),
        6,
        source_ip,
        destination_ip,
        metadata,
    )
}

#[allow(clippy::too_many_arguments)]
fn parse_tcp<'a>(
    data: &'a [u8],
    offset: usize,
    packet_end: usize,
    truncated: bool,
    ip_version: u8,
    source_ip: [u8; 16],
    destination_ip: [u8; 16],
    metadata: &CaptureMetadata,
) -> Option<TcpPacket<'a>> {
    if offset.checked_add(20)? > packet_end {
        return None;
    }
    let tcp_header_len = usize::from(data[offset + 12] >> 4) * 4;
    if tcp_header_len < 20 || offset.checked_add(tcp_header_len)? > packet_end {
        return None;
    }
    let payload_start = offset + tcp_header_len;
    Some(TcpPacket {
        timestamp_ticks: metadata.timestamp_ticks,
        interface_index: metadata.interface_index,
        subinterface_index: metadata.subinterface_index,
        outbound: metadata.outbound,
        loopback: metadata.loopback,
        ip_version,
        source_ip,
        destination_ip,
        source_port: read_u16_be(data, offset)?,
        destination_port: read_u16_be(data, offset + 2)?,
        sequence_number: read_u32_be(data, offset + 4)?,
        acknowledgement_number: read_u32_be(data, offset + 8)?,
        tcp_flags: data[offset + 13],
        truncated,
        payload: data.get(payload_start..packet_end)?,
    })
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

    fn ipv4_tcp(payload: &[u8]) -> Vec<u8> {
        let total = 40 + payload.len();
        let mut packet = vec![0_u8; total];
        packet[0] = 0x45;
        packet[2..4].copy_from_slice(&u16::try_from(total).unwrap().to_be_bytes());
        packet[9] = 6;
        packet[12..16].copy_from_slice(&[10, 0, 0, 1]);
        packet[16..20].copy_from_slice(&[10, 0, 0, 2]);
        packet[20..22].copy_from_slice(&1234_u16.to_be_bytes());
        packet[22..24].copy_from_slice(&443_u16.to_be_bytes());
        packet[24..28].copy_from_slice(&5_u32.to_be_bytes());
        packet[28..32].copy_from_slice(&6_u32.to_be_bytes());
        packet[32] = 0x50;
        packet[33] = 0x18;
        packet[40..].copy_from_slice(payload);
        packet
    }

    #[test]
    fn parses_ipv4_tcp_payload() {
        let bytes = ipv4_tcp(&[1, 2, 3]);
        let packet = parse_tcp_packet(&bytes, &metadata()).unwrap();
        assert_eq!(packet.ip_version, 4);
        assert_eq!(packet.source_ip[12..], [10, 0, 0, 1]);
        assert_eq!(packet.destination_port, 443);
        assert_eq!(packet.sequence_number, 5);
        assert_eq!(packet.tcp_flags, 0x18);
        assert_eq!(packet.payload, [1, 2, 3]);
    }

    #[test]
    fn honors_tcp_header_options() {
        let mut bytes = ipv4_tcp(&[9, 10]);
        bytes.splice(40..40, [1, 1, 1, 1]);
        let packet_len = u16::try_from(bytes.len()).unwrap();
        bytes[2..4].copy_from_slice(&packet_len.to_be_bytes());
        bytes[32] = 0x60;
        let packet = parse_tcp_packet(&bytes, &metadata()).unwrap();
        assert_eq!(packet.payload, [9, 10]);
    }

    #[test]
    fn marks_short_capture_as_truncated() {
        let mut bytes = ipv4_tcp(&[1, 2, 3]);
        bytes.truncate(42);
        let packet = parse_tcp_packet(&bytes, &metadata()).unwrap();
        assert!(packet.truncated);
        assert_eq!(packet.payload, [1, 2]);
    }

    #[test]
    fn rejects_non_initial_ipv4_fragment() {
        let mut bytes = ipv4_tcp(&[]);
        bytes[6..8].copy_from_slice(&1_u16.to_be_bytes());
        assert!(parse_tcp_packet(&bytes, &metadata()).is_none());
    }

    #[test]
    fn parses_ipv6_tcp_payload() {
        let payload = [7, 8];
        let mut bytes = vec![0_u8; 60 + payload.len()];
        bytes[0] = 0x60;
        bytes[4..6].copy_from_slice(&(22_u16).to_be_bytes());
        bytes[6] = 6;
        bytes[8..24].copy_from_slice(&[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 10, 0, 0, 1]);
        bytes[24..40].copy_from_slice(&[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 10, 0, 0, 2]);
        bytes[40..42].copy_from_slice(&80_u16.to_be_bytes());
        bytes[42..44].copy_from_slice(&9000_u16.to_be_bytes());
        bytes[52] = 0x50;
        bytes[53] = 0x10;
        bytes[60..].copy_from_slice(&payload);
        let packet = parse_tcp_packet(&bytes, &metadata()).unwrap();
        assert_eq!(packet.ip_version, 6);
        assert_eq!(packet.payload, payload);
    }

    #[test]
    fn walks_ipv6_extension_headers() {
        let payload = [11, 12];
        let mut bytes = vec![0_u8; 68 + payload.len()];
        bytes[0] = 0x60;
        bytes[4..6].copy_from_slice(&(30_u16).to_be_bytes());
        bytes[6] = 0;
        bytes[40] = 6;
        bytes[41] = 0;
        bytes[48..50].copy_from_slice(&80_u16.to_be_bytes());
        bytes[50..52].copy_from_slice(&9000_u16.to_be_bytes());
        bytes[60] = 0x50;
        bytes[61] = 0x10;
        bytes[68..].copy_from_slice(&payload);
        let packet = parse_tcp_packet(&bytes, &metadata()).unwrap();
        assert_eq!(packet.payload, payload);
    }

    #[test]
    fn rejects_malformed_and_non_tcp_packets() {
        assert!(parse_tcp_packet(&[], &metadata()).is_none());
        let mut bytes = ipv4_tcp(&[]);
        bytes[9] = 17;
        assert!(parse_tcp_packet(&bytes, &metadata()).is_none());
        bytes[9] = 6;
        bytes[0] = 0x41;
        assert!(parse_tcp_packet(&bytes, &metadata()).is_none());
    }
}
