//! antlr-rust-runtime MySQL benchmark target — faithful analog of the reference
//! `antlr4-cpp`/`antlr4ng` runners in mike-lischke/antlr4-runtime-benchmarks.
//!
//! Methodology (identical to the reference):
//!   * split each file on `$$$`; per statement, time `tokenize` then `errorCheck`
//!     (error-check parse WITHOUT building the CST, matching setBuildParseTree(false));
//!   * 1 cold run + 5 warm runs; cold = fresh learned-DFA state, warm = reused;
//!   * warm result = drop the 2 slowest of the 5, average the remaining 3;
//!   * report per file: `<lex> ms, <parse> ms`.
//!
use std::path::PathBuf;
use std::time::Instant;

use mysql_bench::ParseService;

const FILES: [&str; 3] = [
    "statements.txt",
    "bitrix_queries_cut.sql",
    "sakila-db/sakila-data.sql",
];

fn data_dir() -> PathBuf {
    // Override with MYSQL_BENCH_DATA; defaults to the benchmark repo layout
    // (../../data relative to this target dir, matching the other targets).
    std::env::var("MYSQL_BENCH_DATA")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("../../data"))
}

fn split(path: &std::path::Path) -> Vec<String> {
    let sql = std::fs::read_to_string(path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
    sql.split("$$$").map(str::to_owned).collect()
}

/// Returns (lex_ms, parse_ms) for one pass over all files' statements.
fn parse_files(
    service: &mut ParseService,
    files: &[(String, Vec<String>)],
    clear_dfa: bool,
) -> Vec<(String, f64, f64)> {
    let mut out = Vec::new();
    for (name, stmts) in files {
        if clear_dfa {
            service.clear_dfa();
        }
        let mut lex_us = 0u128;
        let mut parse_us = 0u128;
        for stmt in stmts {
            if stmt.trim().is_empty() {
                continue;
            }
            let t = Instant::now();
            service.tokenize(stmt);
            lex_us += t.elapsed().as_micros();

            let t = Instant::now();
            let errs = service.error_check();
            parse_us += t.elapsed().as_micros();
            if errs > 0 {
                // Match the reference C++/TS targets, which abort on the first
                // failing statement: a parse failure is a correctness regression,
                // and continuing would produce misleading timing numbers.
                panic!(
                    "{name}: a statement failed to parse ({errs} error(s)):\n{stmt}"
                );
            }
        }
        out.push((name.clone(), lex_us as f64 / 1000.0, parse_us as f64 / 1000.0));
    }
    out
}

fn main() {
    let dir = data_dir();
    let files: Vec<(String, Vec<String>)> = FILES
        .iter()
        .map(|f| (f.to_string(), split(&dir.join(f))))
        .collect();

    // Run everything on one worker thread with a generous stack: warm-DFA reuse
    // happens on this thread, and a big stack avoids the macOS main-thread
    // headroom limit on the largest INSERTs.
    std::thread::Builder::new()
        .stack_size(64 * 1024 * 1024)
        .spawn(move || {
            let mut service = ParseService::default();
            println!("begin benchmark: antlr-rust-runtime");

            // Cold run.
            let cold = parse_files(&mut service, &files, true);
            print_round("cold", &cold);

            // 5 warm runs; keep per-file (lex, parse) samples.
            let mut samples: Vec<Vec<(f64, f64)>> = vec![Vec::new(); files.len()];
            for _ in 0..5 {
                let r = parse_files(&mut service, &files, false);
                for (i, (_, lex, parse)) in r.iter().enumerate() {
                    samples[i].push((*lex, *parse));
                }
            }

            println!("\nwarm (5 runs, drop 2 slowest by total, avg the rest):");
            let mut tot_lex = 0.0;
            let mut tot_parse = 0.0;
            for (i, (name, _)) in files.iter().enumerate() {
                let mut s = samples[i].clone();
                // Drop the 2 slowest by TOTAL (lex+parse), matching the repo's
                // run-all collector, then average the rest.
                s.sort_by(|a, b| (a.0 + a.1).total_cmp(&(b.0 + b.1)));
                let keep = &s[..3]; // drop 2 slowest
                let lex = keep.iter().map(|x| x.0).sum::<f64>() / keep.len() as f64;
                let parse = keep.iter().map(|x| x.1).sum::<f64>() / keep.len() as f64;
                tot_lex += lex;
                tot_parse += parse;
                println!("    {}: {:.0} ms ⧸ {:.0} ms ⧸ {:.0} ms", base(name), lex, parse, lex + parse);
            }
            println!(
                "    TOTAL: {:.0} ms ⧸ {:.0} ms ⧸ {:.0} ms",
                tot_lex, tot_parse, tot_lex + tot_parse
            );
            println!("\nend benchmark: antlr-rust-runtime");
        })
        .unwrap()
        .join()
        .unwrap();
}

fn print_round(label: &str, r: &[(String, f64, f64)]) {
    print!("{label}: ");
    let mut tl = 0.0;
    let mut tp = 0.0;
    for (name, lex, parse) in r {
        print!("{}={:.0}⧸{:.0} ", base(name), lex, parse);
        tl += lex;
        tp += parse;
    }
    println!("| total {:.0}⧸{:.0} ms", tl, tp);
}

fn base(p: &str) -> &str {
    p.rsplit('/').next().unwrap_or(p)
}
