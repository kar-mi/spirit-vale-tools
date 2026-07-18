/* Bun-process helpers for the custom frameless windows (Windows only).
   Ported from the proven setup in ffxiv_gear_setup/src/desktop/index.ts. */

import { dlopen, FFIType, ptr, type Pointer } from "bun:ffi";

/**
 * Enable per-monitor DPI awareness before any window is created.
 * bun.exe ships without a DPI-aware manifest, so without this call Windows
 * renders the WebView at 96 DPI and then upscales the result — causing blur.
 */
export function makeProcessDpiAware(): void {
  if (process.platform !== "win32") return;
  try {
    const shcore = dlopen("shcore", {
      SetProcessDpiAwareness: { args: [FFIType.i32], returns: FFIType.i32 },
    });
    const PROCESS_PER_MONITOR_DPI_AWARE = 2;
    // E_ACCESSDENIED means awareness was already set — not an error.
    shcore.symbols.SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
  } catch (error) {
    console.warn("[ui-theme] could not set DPI awareness:", error);
  }
}

/**
 * Ask DWM for rounded window corners. Best-effort: Windows may ignore the
 * hint for frameless windows, in which case the window stays square. Do not
 * round the inner shell in CSS — a rounded shell over a square native window
 * produces a double-corner artifact.
 */
export function applyRoundedCorners(windowPtr: unknown): void {
  if (process.platform !== "win32") return;
  const handle = windowPtr as Pointer | null | undefined;
  if (!handle) return;
  try {
    const dwmapi = dlopen("dwmapi", {
      DwmSetWindowAttribute: {
        args: [FFIType.ptr, FFIType.i32, FFIType.ptr, FFIType.u32],
        returns: FFIType.i32,
      },
    });
    const DWMWA_WINDOW_CORNER_PREFERENCE = 33;
    const DWMWCP_ROUND = 2;
    const preference = new Uint32Array([DWMWCP_ROUND]);
    dwmapi.symbols.DwmSetWindowAttribute(
      handle,
      DWMWA_WINDOW_CORNER_PREFERENCE,
      ptr(preference),
      preference.byteLength,
    );
  } catch (error) {
    console.warn("[ui-theme] could not request rounded corners:", error);
  }
}
