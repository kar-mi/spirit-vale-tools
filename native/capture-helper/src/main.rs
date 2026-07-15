#[cfg(target_os = "windows")]
mod windows_main {
    use std::env;
    use std::io::{self, Read};
    use std::path::PathBuf;
    use std::sync::{
        Arc, RwLock,
        atomic::{AtomicBool, Ordering},
    };
    use std::thread;
    use std::time::{Duration, Instant};

    use spiritvale_capture::ipc::FrameWriter;
    use spiritvale_capture::packet::parse_transport_packet;
    use spiritvale_capture::target::{
        AttributionBuffer, TargetSnapshot, TargetStatusTracker, windows as target_windows,
    };
    use spiritvale_capture::windivert::{WinDivertCapture, shutdown_handle};

    struct Arguments {
        filter: String,
        dll_path: PathBuf,
        process_name: Option<String>,
    }

    #[allow(clippy::too_many_lines)]
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

        let target = arguments.process_name.as_deref().map(|process_name| {
            let initial = match target_windows::refresh(process_name, 1) {
                Ok(snapshot) => snapshot,
                Err(error) => {
                    let _ = writer.warning(&format!(
                        "could not read target endpoint tables yet: {error}"
                    ));
                    TargetSnapshot {
                        generation: 1,
                        ..TargetSnapshot::default()
                    }
                }
            };
            let _ = writer.target_status(
                process_name,
                &initial.process_ids.iter().copied().collect::<Vec<_>>(),
            );
            let shared = Arc::new(RwLock::new(initial));
            let worker_shared = Arc::clone(&shared);
            let worker_stopping = Arc::clone(&stopping);
            let worker_name = process_name.to_owned();
            let worker = thread::spawn(move || {
                while !worker_stopping.load(Ordering::Acquire) {
                    thread::sleep(Duration::from_millis(100));
                    let current_generation =
                        worker_shared.read().map_or(1, |current| current.generation);
                    if let Ok(mut next) =
                        target_windows::refresh(&worker_name, current_generation + 1)
                        && let Ok(mut current) = worker_shared.write()
                        && (current.process_ids != next.process_ids
                            || current.tcp_flows != next.tcp_flows
                            || current.udp_endpoints != next.udp_endpoints)
                    {
                        next.generation = current.generation + 1;
                        *current = next;
                    }
                }
            });
            (process_name.to_owned(), shared, worker)
        });
        let mut last_generation = target.as_ref().map_or(0, |(_, snapshot, _)| {
            snapshot.read().map_or(0, |value| value.generation)
        });
        let mut target_status = target.as_ref().map(|(_, snapshot, _)| {
            TargetStatusTracker::new(snapshot.read().map_or_else(
                |_| std::collections::BTreeSet::default(),
                |value| value.process_ids.clone(),
            ))
        });
        let mut pending = AttributionBuffer::new();

        loop {
            match capture.receive() {
                Ok(frame) => {
                    if let Some(packet) = parse_transport_packet(frame.bytes, &frame.metadata) {
                        if let Some((process_name, shared, _)) = &target {
                            let snapshot = shared
                                .read()
                                .map_or_else(|_| TargetSnapshot::default(), |value| value.clone());
                            let now = Instant::now();
                            if snapshot.generation != last_generation {
                                last_generation = snapshot.generation;
                                if target_status
                                    .as_mut()
                                    .is_some_and(|status| status.update(&snapshot.process_ids))
                                    && writer
                                        .target_status(
                                            process_name,
                                            &snapshot
                                                .process_ids
                                                .iter()
                                                .copied()
                                                .collect::<Vec<_>>(),
                                        )
                                        .is_err()
                                {
                                    return 1;
                                }
                                for delayed in pending.drain_matches(&snapshot, now) {
                                    if writer.packet(&delayed).is_err() {
                                        return 1;
                                    }
                                }
                            }
                            if snapshot.matches(&packet) {
                                if writer.packet(&packet).is_err() {
                                    return 1;
                                }
                            } else {
                                pending.push(packet, now);
                            }
                        } else if writer.packet(&packet).is_err() {
                            return 1;
                        }
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
        if let Some((_, _, worker)) = target {
            let _ = worker.join();
        }
        let _ = writer.stopped();
        0
    }

    fn parse_arguments() -> Result<Arguments, String> {
        let mut filter = String::from("tcp or udp");
        let mut dll_path = default_dll_path()?;
        let mut process_name = None;
        let mut args = env::args().skip(1);
        while let Some(argument) = args.next() {
            match argument.as_str() {
                "--filter" => filter = args.next().ok_or("--filter requires a value")?,
                "--dll" => dll_path = PathBuf::from(args.next().ok_or("--dll requires a value")?),
                "--process-name" => {
                    process_name = Some(args.next().ok_or("--process-name requires a value")?);
                }
                "--help" | "-h" => {
                    return Err(String::from(
                        "usage: spiritvale-capture.exe [--filter <WinDivert filter>] [--dll <WinDivert.dll>] [--process-name <executable.exe>]",
                    ));
                }
                _ => return Err(format!("unknown argument: {argument}")),
            }
        }
        Ok(Arguments {
            filter,
            dll_path,
            process_name,
        })
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
