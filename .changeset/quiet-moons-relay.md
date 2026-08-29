---
"@kar-mi/spirit-vale-tools-capture": minor
---

Suppress the redundant packet copies a redirecting VPN puts on the wire.

Relays such as ExitLag do not encapsulate game traffic. They rewrite addresses and ports and send
the same datagram over several routes at once, so Npcap observes one datagram more than once:
once as the relay's copy and once as the copy carrying the game's own endpoints, byte-identical in
payload and differing only in the rewritten header fields. Both copies share the game's local port,
so both passed process attribution and every decoder downstream counted them twice. In a recorded
ExitLag session 37% of captured packets were such copies, and combat totals doubled accordingly.

Capture now keys each packet on its payload and direction — never on addresses or ports, which are
exactly what a relay rewrites — and admits only the first sighting inside a five-millisecond window.
That window is measured rather than guessed: relayed copies arrive with a median gap of 0 ms and a
90th percentile of 1 ms, while a clean session repeats a payload in the same direction at 70-90 ms.
Replaying the recorded sessions, it removes exactly the duplicated half of the relayed traffic - 2190
of 4380 game packets, every relay copy and no genuine packet - against 0-0.3% of clean captures, and
the handful it removes from those are byte-identical retransmissions on an identical five-tuple that
LiteNetLib's own sequencing already discards.

The key is the payload together with the direction and the local port, never the peer's address or
port, which are what a relay rewrites. The local port matters in its own right: two connections
opening at once send byte-identical `connectRequest` payloads, and without it the second connection
is swallowed and never reported.

Suppressed copies are reported periodically as a warning naming the adapter in use, since a nonzero
count means traffic is being relayed and a different adapter may carry it directly. Set
`suppressDuplicates: false` to observe the wire exactly as captured.

Two further fixes came out of the same investigation.

A connection is now named by the game's own socket rather than by its endpoint pair. A relay does
not rewrite endpoints symmetrically - the copy it delivers inbound carries its own relay port where
the server's belongs - so the two directions of one connection sorted to two different names. That
split everything keyed on the name, the session decoder's links and splits and the connection
`PacketCapture` reports, leaving each direction blind to what the other established. On a relayed
capture it accounted for a third of all unresolved SyncTypes: 37.6% fell to 26.0%, and the player's
own character went from 255 orphaned health and mana updates to 2. With no relay in the path the
grouping is unchanged, verified identical across twelve unrelayed captures - though only four of
those contain a connect or disconnect, so the connection events it also names rest on that smaller
set.

Capture also now explains what it discards. A packet that cannot be attributed is counted against
its flow along with one statistic - how often a LiteNetLib sequence number follows its predecessor -
and the busiest flows are reported with a verdict on each. A real stream is overwhelmingly
consecutive; unrelated traffic that merely parses as LiteNetLib is not. Answering that question
previously meant `--all-processes`, which writes every application's payloads to disk; this retains
none, so the summary is safe to share. A discarded flow that does carry game traffic is raised as
its own warning, and it is the only case worth acting on.
