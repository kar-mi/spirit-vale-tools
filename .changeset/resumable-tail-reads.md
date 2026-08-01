---
"@kar-mi/spirit-vale-tools-logging": minor
---

Let `JsonlTailReader` resume from a stored byte offset.

New `startOffset` and `maxReadBytes` options, plus an `offset` getter and a
`bytesRead` field on the read result. Together these let a caller persist its
position, resume in a later process, and bound how much one read consumes.

`offset` reports the position just past the last **complete** line, excluding any
buffered partial line, so a persisted offset never lands mid-record. Resuming and
`offset` both assume newline-delimited UTF-8, as written by this package's logger;
byte-order-mark sniffing only applies to a reader starting at 0. Existing
behaviour — truncation detection, partial-line buffering, decoder selection — is
unchanged.
