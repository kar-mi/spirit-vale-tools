# Packages

The reusable Bun packages are published to npm and GitHub Packages under the
`@kar-mi` scope. npm consumers can install a package directly:

```powershell
bun add @kar-mi/spirit-vale-tools-capture
```

To use GitHub Packages instead, configure the scope in the consuming
repository:

```ini
@kar-mi:registry=https://npm.pkg.github.com
```

Install only the capability required by the application. For example, packet
capture is available through:

```ts
import { PacketCapture } from "@kar-mi/spirit-vale-tools-capture/capture";
```

Live capture runs on Bun for Windows and requires a separately installed compatible Npcap runtime.
