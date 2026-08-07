# @kar-mi/spirit-vale-tools-logging

Session-oriented logging utilities for Spirit Vale tools.

> **Internal package.** This package is published only because the domain
> packages (`combat`, `market`, `rewards`) depend on it at runtime; it is
> installed automatically alongside them and is not a supported public API.

## Install

```sh
bun add @kar-mi/spirit-vale-tools-logging
```

## Usage

```ts
import { createLogSession } from "@kar-mi/spirit-vale-tools-logging";

const session = await createLogSession({
  producer: "my-tool",
  streams: ["capture", "combat"],
});

const logger = session.logger("combat");
logger.log("combat.event", { kind: "damage", amount: 42 });

await session.flush(); // records so far are on disk; the session stays usable
await session.close();
```

## Buffering

`log()` is synchronous and buffers records into byte-bounded batches, appended through one file
handle per stream. Tune with `batchBytes` (default 256 KiB), `flushIntervalMs` (default 50 ms), and
`maxBufferedBytes` (default 8 MiB) on `createLogSession`, or per logger.

- `session.flush()` / `logger.flush()` resolve once everything logged before the call is on disk.
  Call it before a process exits by any path other than `close()`.
- A write failure is reported once through `onWriteError` and rethrown by `flush()`/`close()`, but
  later batches are still attempted — a transient error does not stop logging.
- Records are only dropped when they would push memory past `maxBufferedBytes` (a stalled disk).
  Each such episode is reported once through `onWriteError`, counted in `logger.stats()`, and the
  logger resumes accepting records as soon as the queue drains. Sequence numbers are assigned before
  the drop, so a dropped record leaves a gap that readers can detect.

```ts
logger.stats(); // { bufferedBytes, queuedBatches, failed, droppedRecords }
```

## Reading

`subscribeToLogStream` is the single tail of one stream, shared by every consumer of it: one
`fs.watch` on the current-stream pointer, one on the active session file, one `JsonlTailReader`,
and one fallback poll — regardless of how many overlays are attached. The domain packages build
their followers on it; use it directly only for a stream they do not cover.

```ts
const subscription = subscribeToLogStream({ stream: "combat" });
for await (const read of subscription) process(read.lines);
subscription.close();
```

`next()` settles only when there is something to report, so an idle stream costs nothing beyond a
debounced watcher event. `poll()` remains for consumers driving their own clock; unlike `next()` it
always re-reads the pointer, so it reflects a session switch as of the call. Watcher events on
Windows can be coalesced or dropped around rotation and rename, so `DEFAULT_STREAM_FALLBACK_POLL_MS`
bounds how long such a miss can stall a consumer.

See the [package guide](https://github.com/kar-mi/spirit-vale-tools/blob/main/docs/packages.md) for registry setup and usage.
