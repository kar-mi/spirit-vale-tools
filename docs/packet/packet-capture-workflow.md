# Packet Capture Workflow

Spirit Vale Tools captures TCP and UDP traffic through the user's existing Npcap installation. Bun loads the Npcap API directly, selects a network adapter, normalizes link-layer frames, and restricts emitted packets to endpoints owned by the configured executable.

The package does not bundle Npcap, install drivers, inject packets, or alter traffic.

For the UDP decoding layers enabled by this workflow, see [Packet Decoding](packet-decoding.md). For the
packages that consume decoded events, see [Packet Routing](packet-routing.md).

## Windows Prerequisites

- Windows 10 or 11 x64
- Bun 1.4 or newer for development
- A current Npcap installation from [npcap.com](https://npcap.com/#download)

To run live capture without elevation, install Npcap with **Restrict Npcap
driver's access to Administrators only** unchecked. Consumers can inspect
`getNpcapStatus()` and `listNpcapDevices()` to report installation and adapter
availability.

## Linux Prerequisites

- A standard linux distrobution
- Bun 1.4 or newer for development
- libpcap

To run live capture without elevation, give bun `CAP_NET_RAW` & 
`CAP_NET_ADMIN` permissions.

```sh
# sudo: substitute user (aka as temporary root)
# setcap: Set capabilities
# cap_net_raw: Allows raw and packet sockets (required for packet capture).
# cap_net_admin: Allows network interface configuration and administration.
# +ep: Adds the capabilities to the Effective and Permitted sets.
# $(which bun): Specify which executable gets the permission, if you have more then 1 bun executable for example, or wish to create a wrapper, you may want to change this.
sudo setcap 'cap_net_raw,cap_net_admin=+ep' $(which bun)

# Verify permissions: You can verify the capabilities were set correctly using:
getcap $(which bun)
```

Other Linux Capabilities & Permissions:

* `capsh` for a temporary shell session with specified capabilities.
* `CAP_AMBIENT` for ambient capabilities, allows for spawned child `execve()` processes to inherit capabilities.
* `setuid` "set user identity and set group identity", the usual file permissions.
* `docker` container with `--cap-add NET_RAW --cap-add NET_ADMIN`.
* Wrappers, a script or program that sets the capabilities and launches the process. So you could have a `./bun_net_raw ./script.js` app, that launches regular `./bun` with the added capabilities, flags & commandline arguments. So that other bun scripts will continue to run without `NET_RAW` perms.

Linux `capsh` & `CAP_AMBIENT` Example:

```sh
# Example: Launch bun in a shell with ambient capabilities
sudo capsh --caps="cap_net_raw,cap_net_admin+ep" \
           --keep=1 \
           --user=$(whoami) \
           --inh=cap_net_raw,cap_net_admin=i \
           -- -c "export CAP_AMBIENT=1; bun /path/to/script.js"
```

Linux NixOS wrapper example:

```nix
nixosConfigurations.yourhostname = nixpkgs.lib.nixosSystem {
  # …
  modules = [
    ({ pkgs, ... }: {
      security.wrappers.bun_net_raw = {
        source = "${pkgs.bun}/bin/bun";
        owner = "root";
        group = "root";
        capabilities = "cap_net_raw,cap_net_admin+eip";
      };
    })
    # …
  ];
};
```

## Command-line capture

Run a process-attributed capture:

```powershell
bun run capture:dump -- --duration 30
```

Useful options:

```powershell
# UDP only
bun run capture:dump -- --protocols udp

# Select a stable Npcap device name
bun run capture:dump -- --adapter <device-name>

# Follow another executable
bun run capture:dump -- --process OtherGame.exe

# Capture without process attribution
bun run capture:dump -- --all-processes

# Apply a standard BPF capture filter
bun run capture:dump -- --all-processes --filter "tcp port 443"

# Decode LiteNetLib and FishNet
bun run capture:dump -- --protocols udp --decode-fishnet
```

The default filter is derived from `--protocols`. Custom filters use standard libpcap/BPF syntax.

## Capture path

1. The capture package verifies that the loaded capture library identifies itself as Npcap.
2. Npcap enumerates available adapters and the selected adapter is opened in non-promiscuous, immediate, nonblocking mode.
3. Ethernet, VLAN, loopback, raw-IP, and common VPN link-layer frames are reduced to IPv4 or IPv6 packets.
4. TCP and UDP headers and payloads are normalized into the public TypeScript packet types.
5. Windows process and endpoint tables are refreshed while capture is active. Only packets matching endpoints owned by the target executable are emitted.
6. Redundant copies of a packet already seen are suppressed, so a relaying VPN cannot make a single datagram decode twice.
7. UDP payloads optionally continue through LiteNetLib and FishNet decoding; the detailed wire layouts,
   state, and emitted types are documented in [Packet Decoding](packet-decoding.md).

Packets that arrive before a new socket appears in the endpoint table are retained only in memory for five endpoint-table refreshes, with a maximum of 16,384 packets. Expired unmatched packets are discarded, and the count is reported as a warning.

## Public API

```ts
import { PacketCapture, getNpcapStatus, listNpcapDevices } from "@kar-mi/spirit-vale-tools-capture/capture";

const status = await getNpcapStatus();
const devices = status.availability === "ready" ? await listNpcapDevices() : [];

const capture = new PacketCapture();
capture.on("targetStatus", target => console.log(target.state, target.processIds));
capture.on("udpPacket", packet => console.log(packet.sourcePort, packet.destinationPort));
capture.on("fishNetPacket", packet => console.log(packet.tick, packet.packetName));

await capture.start({
  protocols: ["udp"],
  targetProcessName: "SpiritVale.exe",
  deviceName: devices[0]?.name,
  decodeFishNet: true,
});
```

Omit `deviceName` for automatic adapter selection. Omit `targetProcessName` only for unrestricted diagnostics.

## Troubleshooting

### Npcap is not installed

Install the current Npcap release, then call `getNpcapStatus()` again.

### Npcap is administrator-only

Reinstall Npcap with its administrator-only restriction unchecked. Spirit Vale Tools does not bypass that security setting.

### No usable adapters are shown

Confirm Npcap is running correctly and refresh the adapter list. VPN software may expose an additional adapter that must be selected manually.

### Damage or event totals are doubled, or a "suppressed N duplicate packets" warning appears

Redirecting VPNs such as ExitLag do not encapsulate game traffic. They rewrite addresses and ports
and send the same datagram over several routes at once, so Npcap observes one datagram more than
once: once as the relay's copy and once as the copy carrying the game's own endpoints, identical in
payload and differing only in the rewritten header fields. Left alone, every decoder downstream
counts it twice.

Capture suppresses those copies automatically, keying on the payload and direction within a
five-millisecond window. Set `suppressDuplicates: false` only to inspect the wire exactly as
observed. The warning itself is informational; it names the adapter in use so that a better one can
be chosen through `deviceName` if decoding still looks incomplete, since which adapter a relay
leaves carrying clean traffic varies by its redirection mode.

The `gave up on N packets that could not be attributed to the target process` warning is separate
and is usually not about the relay at all. `--protocols udp` places no port filter on the adapter,
so every unattributed datagram from any other software on the machine is counted there - QUIC on
:443, STUN, discovery traffic. A measured diagnostic capture on a relayed session found the drops
were almost entirely such traffic, while every game flow was attributed correctly. Treat a high
count as noise unless decoded output is actually missing.

Capture answers that question for you rather than leaving it to inspection. Alongside the count it
reports the busiest discarded flows and a verdict on each:

```
[dropped]  3818 udp 192.0.2.10:57473 -> 203.0.113.5:23249   (unrelated)
[dropped]  1628 udp 198.51.100.20:7001 -> 192.0.2.10:57472 (game traffic)
```

The verdict comes from LiteNetLib sequence numbers: a real stream is overwhelmingly consecutive,
while unrelated traffic whose first byte happens to parse as a header is not. No payload is retained,
so the summary is safe to share. A flow marked `game traffic` is the only case worth acting on, and
it is reported as its own warning. This replaces `--all-processes` for diagnosis, which answered the
same question only by logging every application's payloads to disk.

### Target remains waiting

Confirm the executable is running and that its filename matches `targetProcessName`. The comparison uses the executable filename, not the window title.

### Capture is active but no packets appear

- Try Automatic adapter selection first, then the adapter carrying the game's route.
- Remove a restrictive BPF filter.
- Use `--all-processes` temporarily to separate adapter problems from process attribution problems.
- Confirm the configured protocol includes the game's traffic.

## Safety boundaries

- Capture is passive and non-promiscuous; it does not inject, drop, or modify packets.
- Npcap must be installed separately under its own license.
- Device identifiers and adapter addresses remain in local settings/runtime state and are not written to tracked fixtures or diagnostic logs.
- UDP attribution is endpoint-based; deliberate port sharing by multiple processes can be ambiguous.
