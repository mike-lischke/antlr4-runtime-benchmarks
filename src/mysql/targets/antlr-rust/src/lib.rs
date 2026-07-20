//! A faithful MySQL parser built on `antlr-rust-runtime`, for the
//! `antlr4-runtime-benchmarks` MySQL workload.
//!
//! The grammar (Oracle's official `MySQLLexer.g4` / `MySQLParser.g4`) is
//! target-coupled: it drives ~246 semantic predicates and 41 lexer custom
//! actions through a `MySQLBaseLexer` / `MySQLRecognizerCommon` base class. This
//! crate ports those base classes into [`MySqlHooks`] (see [`hooks`]) so the
//! Rust parse takes the exact same grammar paths the C++/TS reference runtimes
//! take at a fixed `serverVersion` + `sqlMode`.

#![allow(clippy::missing_errors_doc)]

mod generated {
    #![allow(warnings)]
    #![allow(clippy::all, clippy::pedantic, clippy::nursery)]
    pub mod my_sql_lexer;
    pub mod my_sql_parser;
}

pub mod hooks;

use antlr4_runtime::{CommonTokenStream, InputStream, Parser, PredictionMode};
pub use hooks::MySqlHooks;

use generated::my_sql_lexer::MySqlLexer;
use generated::my_sql_parser::MySqlParser;

/// The lexer instantiation used throughout: a `MySqlLexer` over an in-memory
/// `InputStream`, driven by the base-class [`MySqlHooks`].
pub type HookedLexer = MySqlLexer<InputStream, MySqlHooks>;

/// The parser instantiation used by the benchmark service.
pub type HookedParser = MySqlParser<HookedLexer, MySqlHooks>;

/// Long-lived lexer, token stream, and parser stack matching the reference
/// runtimes' `ParseService`.
pub struct ParseService {
    parser: HookedParser,
}

impl ParseService {
    /// Builds one recognizer stack for repeated MySQL statements.
    #[must_use]
    pub fn new(server_version: u32, sql_mode: u32) -> Self {
        let lexer = MySqlLexer::with_hooks(
            InputStream::new(""),
            MySqlHooks::new(server_version, sql_mode),
        );
        let tokens = CommonTokenStream::new(lexer);
        let mut parser =
            MySqlParser::with_hooks(tokens, MySqlHooks::new(server_version, sql_mode));
        parser.set_build_parse_trees(false);
        parser.set_prediction_mode(PredictionMode::Sll);
        Self { parser }
    }

    /// Re-feeds the lexer and rebuilds the parser-owned token buffer.
    pub fn tokenize(&mut self, input: &str) {
        let tokens = self.parser.token_stream_mut();
        let lexer = tokens.token_source_mut();
        lexer.set_input_stream(InputStream::new(input));
        // Route through the generated lexer's hook-aware reset so MySqlHooks
        // clears its version-comment state between statements (set_input_stream
        // only resets runtime-owned lexer state, not the hook's).
        lexer.reset();
        tokens.refill();
    }

    /// Parses the tokens produced by the preceding [`Self::tokenize`] call.
    ///
    /// Counts **both** lexer and parser errors, matching the reference targets
    /// (which attach the error listener to the lexer as well as the parser): an
    /// input the lexer rejects — e.g. an unterminated string that gets skipped,
    /// leaving just EOF for the optional top-level `query` rule — must count as a
    /// failure, not silently report zero parser errors.
    #[must_use]
    pub fn error_check(&mut self) -> usize {
        let lexer_errors = self.parser.token_stream_mut().drain_source_errors().len();
        self.parser.reset();
        let parser_errors = match self.parser.query() {
            Ok(_) => self.parser.number_of_syntax_errors(),
            Err(_) => self.parser.number_of_syntax_errors().max(1),
        };
        lexer_errors + parser_errors
    }

    /// Drops learned lexer and parser DFA state for a cold benchmark pass.
    pub fn clear_dfa(&mut self) {
        self.parser
            .token_stream_mut()
            .token_source_mut()
            .clear_dfa();
        self.parser.clear_dfa();
    }
}

impl Default for ParseService {
    fn default() -> Self {
        Self::new(80_400, hooks::sql_mode::ANSI_QUOTES)
    }
}
