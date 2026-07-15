$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Manifest = Join-Path $ProjectRoot "native\capture-helper\Cargo.toml"
$VendorX64 = Join-Path $ProjectRoot "native\vendor\windivert-2.2.2\x64"
$TargetRelease = Join-Path $ProjectRoot "native\capture-helper\target\release"

Push-Location $ProjectRoot
try {
  & bun run fetch:windivert
  if ($LASTEXITCODE -ne 0) { throw "WinDivert fetch failed with exit code $LASTEXITCODE" }

  $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
  if (-not (Test-Path -LiteralPath $vswhere)) {
    throw "Visual Studio Installer was not found. Install Visual Studio 2022 Build Tools with Desktop development with C++."
  }
  $installation = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
  if (-not $installation) {
    throw "MSVC x64 build tools were not found. Install the Desktop development with C++ workload."
  }
  $vsDevCmd = Join-Path $installation "Common7\Tools\VsDevCmd.bat"
  $command = "`"$vsDevCmd`" -no_logo -arch=x64 -host_arch=x64 && cargo build --manifest-path `"$Manifest`" --release"
  & cmd.exe /d /s /c $command
  if ($LASTEXITCODE -ne 0) { throw "Cargo build failed with exit code $LASTEXITCODE" }

  Copy-Item -LiteralPath (Join-Path $VendorX64 "WinDivert.dll") -Destination $TargetRelease -Force
  Copy-Item -LiteralPath (Join-Path $VendorX64 "WinDivert64.sys") -Destination $TargetRelease -Force
  & bun run bundle:native
  if ($LASTEXITCODE -ne 0) { throw "Native bundling failed with exit code $LASTEXITCODE" }
}
finally {
  Pop-Location
}
