# Packages

The reusable Bun packages are published to GitHub Packages under the `@kar-mi` scope. Configure the scope in the consuming repository:

```ini
@kar-mi:registry=https://npm.pkg.github.com
```

Install only the capability required by the application. For example, packet capture is available through:

```powershell
bun add @kar-mi/spirit-vale-tools-capture
```

```ts
import { PacketCapture } from "@kar-mi/spirit-vale-tools-capture/capture";
```

Live capture runs on Bun for Windows and requires a separately installed compatible Npcap runtime.
