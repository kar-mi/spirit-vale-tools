#[cfg(target_os = "windows")]
mod windows_main {
    use std::env;
    use std::io::{self, Read};
    use std::path::PathBuf;
    use std::sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
    };
    use std::thread;

    use spiritvale_capture::ipc::FrameWriter;
    use spiritvale_capture::packet::parse_tcp_packet;
    use spiritvale_capture::windivert::{WinDivertCapture, shutdown_handle};

    struct Arguments {
        filter: String,
        dll_path: PathBuf,
    }

    pub fn main() -> i32 {
        let mut writer = FrameWriter::new(io::stdout().lock());
        let arguments = match parse_arguments() {
            Ok(arguments) => arguments,
            Err(error) => {
                let _ = writer.error(&error);
                eprintln!("[capture-helper] {error}");
                return 2;
            }
        };

        let mut capture = match WinDivertCapture::open(&arguments.dll_path, &arguments.filter) {
            Ok(capture) => capture,
            Err(error) => {
                let message = describe_open_error(&arguments.dll_path, &error);
                let _ = writer.error(&message);
                eprintln!("[capture-helper] {message}");
                return 1;
            }
        };

        let stopping = Arc::new(AtomicBool::new(false));
        let control_stopping = Arc::clone(&stopping);
        let shutdown = capture.shutdown_function();
        let handle = capture.handle_value();
        let control_thread = thread::spawn(move || {
            let mut byte = [0_u8; 1];
            let _ = io::stdin().read(&mut byte);
            control_stopping.store(true, Ordering::Release);
            // SAFETY: `capture` remains alive on the main thread until receive unblocks.
            unsafe { shutdown_handle(shutdown, handle) };
        });

        if writer.ready().is_err() {
            return 1;
        }

        loop {
            match capture.receive() {
                Ok(frame) => {
                    if let Some(packet) = parse_tcp_packet(frame.bytes, &frame.metadata)
                        && writer.packet(&packet).is_err()
                    {
                        return 1;
                    }
                }
                Err(_) if stopping.load(Ordering::Acquire) => break,
                Err(error) => {
                    let message = format!("packet capture failed: {error}");
                    let _ = writer.error(&message);
                    eprintln!("[capture-helper] {message}");
                    return 1;
                }
            }
        }

        let _ = control_thread.join();
        let _ = writer.stopped();
        0
    }

    fn parse_arguments() -> Result<Arguments, String> {
        let mut filter = String::from("tcp");
        let mut dll_path = default_dll_path()?;
        let mut args = env::args().skip(1);
        while let Some(argument) = args.next() {
            match argument.as_str() {
                "--filter" => filter = args.next().ok_or("--filter requires a value")?,
                "--dll" => dll_path = PathBuf::from(args.next().ok_or("--dll requires a value")?),
                "--help" | "-h" => {
                    return Err(String::from(
                        "usage: spiritvale-capture.exe [--filter <WinDivert filter>] [--dll <WinDivert.dll>]",
                    ));
                }
                _ => return Err(format!("unknown argument: {argument}")),
            }
        }
        Ok(Arguments { filter, dll_path })
    }

    fn default_dll_path() -> Result<PathBuf, String> {
        if let Some(path) = env::var_os("SPIRITVALE_WINDIVERT_DLL") {
            return Ok(PathBuf::from(path));
        }
        let executable =
            env::current_exe().map_err(|error| format!("cannot locate capture helper: {error}"))?;
        Ok(executable
            .parent()
            .ok_or("capture helper has no parent directory")?
            .join("WinDivert.dll"))
    }

    fn describe_open_error(path: &std::path::Path, error: &io::Error) -> String {
        match error.raw_os_error() {
            Some(5) => String::from(
                "administrator privileges are required; restart the Bun application from an elevated terminal",
            ),
            Some(2 | 3 | 126) => format!(
                "WinDivert runtime was not found or could not be loaded at {}: {error}",
                path.display()
            ),
            _ => format!(
                "could not start WinDivert capture using {}: {error}",
                path.display()
            ),
        }
    }
}

#[cfg(target_os = "windows")]
fn main() {
    std::process::exit(windows_main::main());
}

#[cfg(not(target_os = "windows"))]
fn main() {
    eprintln!("spiritvale-capture is supported only on Windows");
    std::process::exit(1);
}
