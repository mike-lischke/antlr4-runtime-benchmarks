#!/usr/bin/env bash
# Builds the pure-Rust ANTLR runtime MySQL benchmark target.
# Requires a Rust toolchain (https://rustup.rs). Uses the published
# `antlr-rust-runtime` crate from crates.io (see Cargo.toml).
set -euo pipefail
cd "$(dirname "$0")"
cargo build --release
echo "built: target/release/mysql-benchmark"
