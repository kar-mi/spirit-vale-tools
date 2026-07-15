#![cfg_attr(not(target_os = "windows"), allow(dead_code))]

pub mod ipc;
pub mod packet;
pub mod target;

#[cfg(target_os = "windows")]
pub mod windivert;
