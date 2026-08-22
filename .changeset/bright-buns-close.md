---
"@kar-mi/spirit-vale-tools-capture": minor
"@kar-mi/spirit-vale-tools-sqlite": minor
---

Require Bun 1.4 or newer. The SQLite read model now relies on Bun 1.4's statement ownership and
force-close behavior to release every outstanding database handle immediately on Windows.
