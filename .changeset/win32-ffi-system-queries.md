---
"@kar-mi/spirit-vale-tools-capture": minor
---

Query Windows directly through `kernel32`/`iphlpapi` instead of shelling out to
`tasklist.exe`, `netstat.exe`, `route.exe`, and `reg.exe`. Target tracking now walks a
Toolhelp32 process snapshot and reads the PID-owned TCP/UDP tables through
`GetExtendedTcpTable`/`GetExtendedUdpTable`, and adapter selection reads the default
route through `GetBestRoute` and `GetIpAddrTable`. The tracker refreshes once per
second, so this removes four process spawns and their console-output parsing from
every refresh tick, and drops the locale- and format-sensitivity of scraping
`netstat`/`tasklist`/`route` text.

The new `win32-system.ts` states each `MIB_*_OWNER_PID` row layout once as data - row
size plus the address, port, and owning-PID offsets per protocol and address family -
so one reader walks all four table shapes rather than two near-duplicate readers
branching on family, and the remaining struct constants (`PROCESSENTRY32W`,
`MIB_IPFORWARDROW`, `MIB_IPADDRROW`) are named where they are used.

`NpcapAvailability` no longer includes `"admin-only"`. That state was detected by
reading the `npcap` service's `AdminOnly` registry value through `reg.exe`; an
admin-only install is now reported when it actually blocks capture - `status()` returns
`"error"` when Npcap enumerates no adapters, and opening a device surfaces
`PCAP_ERROR_PERM_DENIED` with guidance to run elevated or reinstall Npcap without the
administrator-only restriction. Consumers matching on the removed `"admin-only"` value
should handle `"error"` instead.

`parseTaskList` and `parseNetstat` are gone from `target-tracker.ts`, and
`chooseDeviceByRouteOutput` is replaced by `chooseDeviceByRouteAddress`, which takes the
resolved address rather than `route.exe` output. None of these were exported from the
package entrypoints.
