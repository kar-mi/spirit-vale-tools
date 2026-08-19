---
"@kar-mi/spirit-vale-tools-capture": minor
---

Recover component bindings for an object whose spawn was never captured.

A capture that attaches mid-session never sees the local player's spawn, so nothing registers its
component layout and every packet on its other components stays unresolved for the whole session —
including the NetworkTransform updates carrying its position.

Resolution now narrows the build's prefab layouts by the bindings already verified on that same
object, and binds another index only where every surviving layout names the same type for it. The
bar is deliberately high: at least one verified binding is required to narrow from, every survivor
must define the wanted index, and they must agree. A layout contradicting a known binding is
discarded; one leaving the index blank abandons the attempt.
