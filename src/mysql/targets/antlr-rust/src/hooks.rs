//! Faithful Rust port of `MySQLBaseLexer` + `MySQLRecognizerCommon` (Oracle's
//! MySQL grammar base classes), wired through `antlr-rust-runtime`'s
//! [`SemanticHooks`]. Mirrors the C++/TS reference implementations from
//! `mysql/mysql-shell-plugins` so our parse takes the same grammar paths at a
//! fixed server version + SQL mode.
//!
//! # Dispatch model
//! The generated lexer/parser call the hook with opaque `(rule_index,
//! pred_index)` / `action_index` integers — the predicate/action *body* text is
//! not available at runtime. `build.rs` reads the `semantics.json` manifests and
//! precomputes, per coordinate:
//!   * predicates → a [`PredKind`] (a compile-time `bool` for the 124 pure
//!     `serverVersion`/`sqlMode` guards, or a [`Stateful`] tag for the 2
//!     version-comment predicates), and
//!   * lexer actions → an [`ActionKind`] tag.
//! The hook is then a table lookup plus, for the handful of genuinely runtime
//! actions, a small port of the base-class method.
//!
//! # Allocation discipline
//! The hot path performs zero heap allocation: predicates are array indexing,
//! actions are integer compares and byte peeks. `text_so_far()` (one `String`)
//! is taken only for the two rules the reference also inspects text for
//! (`INT_NUMBER`, version comments) — matching the C++ `getText()` calls.

use antlr4_runtime::{
    CharStream, LexerCustomAction, LexerLifecycleCtx, LexerSemCtx, ParserSemCtx, SemanticHooks,
    TokenSource, HIDDEN_CHANNEL,
};

use crate::generated::my_sql_lexer as lex;

// Build-time tables: PARSER_PRED, LEXER_PRED, LEXER_ACTION.
include!(concat!(env!("OUT_DIR"), "/semantics_tables.rs"));

/// A predicate coordinate, precomputed by `build.rs`.
#[derive(Clone, Copy)]
pub enum PredKind {
    /// Pure `serverVersion`/`sqlMode` guard, evaluated at build time.
    Const(bool),
    /// Stateful predicate, evaluated at runtime against hook state.
    Stateful(Stateful),
    /// A `pred_index` with no ATN transition in this grammar (gap in the index
    /// space). Never dispatched by the runtime.
    Unreachable,
}

/// The two stateful lexer predicates in the MySQL grammar.
#[derive(Clone, Copy)]
pub enum Stateful {
    /// `{checkMySQLVersion(getText())}?` on `VERSION_COMMENT_START`: parses the
    /// `/*!NNNNN` version and, if `<= serverVersion`, enters a version comment.
    CheckMysqlVersion,
    /// `{inVersionComment}?` on `VERSION_COMMENT_END`: true iff inside one.
    InVersionComment,
}

/// A lexer custom action coordinate, precomputed by `build.rs`.
#[derive(Clone, Copy)]
pub enum ActionKind {
    /// `setType(determineFunction(PROPOSED))`: keep `PROPOSED` iff the next
    /// (whitespace-skipped under IgnoreSpace) char is `(`, else `IDENTIFIER`.
    DetermineFunction(i32),
    /// `setType(determineNumericType(getText()))`: classify an integer literal.
    DetermineNumericType,
    /// `emitDot()`: split a leading `.` into its own `DOT_SYMBOL` token.
    EmitDot,
    /// `setType(checkCharset(getText()))`: `_charset` introducer vs identifier.
    CheckCharset,
    /// `setType(isSqlModeActive(PipesAsConcat) ? CONCAT_PIPES_SYMBOL : LOGICAL_OR_OPERATOR)`.
    PipesOr,
    /// `setType(isSqlModeActive(HighNotPrecedence) ? NOT2_SYMBOL : NOT_SYMBOL)`.
    HighNotPrec,
    /// `inVersionComment = true` (on `MYSQL_COMMENT_START`).
    EnterVersionComment,
    /// `inVersionComment = false` (on `VERSION_COMMENT_END`).
    ExitVersionComment,
}

/// SQL-mode flag bit values, matching `MySQLRecognizerCommon::SqlMode`.
pub mod sql_mode {
    pub const ANSI_QUOTES: u32 = 1 << 0;
    pub const HIGH_NOT_PRECEDENCE: u32 = 1 << 1;
    pub const PIPES_AS_CONCAT: u32 = 1 << 2;
    pub const IGNORE_SPACE: u32 = 1 << 3;
    pub const NO_BACKSLASH_ESCAPES: u32 = 1 << 4;
}

/// The MySQL base-class runtime state: a fixed server version, active SQL modes,
/// the set of recognised charset introducers, and the version-comment flag.
///
/// `server_version` / `sql_mode` are also compiled into the `build.rs` predicate
/// tables; they are retained here for the runtime-evaluated action ternaries
/// (`||`, `NOT`) and the `checkMySQLVersion` predicate.
pub struct MySqlHooks {
    server_version: u32,
    sql_mode: u32,
    in_version_comment: bool,
}

impl Default for MySqlHooks {
    fn default() -> Self {
        // Benchmark settings: tokenize(stmt, 80400, "ANSI_QUOTES").
        Self::new(80_400, sql_mode::ANSI_QUOTES)
    }
}

impl MySqlHooks {
    #[must_use]
    pub const fn new(server_version: u32, sql_mode: u32) -> Self {
        Self { server_version, sql_mode, in_version_comment: false }
    }

    /// `MySQLRecognizerCommon::isSqlModeActive` — a bitmask test.
    #[inline]
    const fn is_sql_mode_active(&self, mode: u32) -> bool {
        (self.sql_mode & mode) != 0
    }
}

impl SemanticHooks for MySqlHooks {
    // ---- Parser predicates: all pure serverVersion/sqlMode guards ----
    fn sempred<S>(
        &mut self,
        _ctx: &mut ParserSemCtx<'_, S>,
        _rule_index: usize,
        pred_index: usize,
    ) -> Option<bool>
    where
        S: TokenSource,
    {
        match PARSER_PRED.get(pred_index) {
            Some(PredKind::Const(b)) => Some(*b),
            // The parser grammar has no stateful predicates. Gaps/OOB are never
            // dispatched by the runtime; returning None triggers the Error policy
            // if one somehow is, keeping the port fail-loud.
            _ => None,
        }
    }

    // ---- Lexer predicates: version/mode guards + 2 stateful version-comment ----
    fn lexer_sempred<I>(
        &mut self,
        ctx: &mut LexerSemCtx<'_, I>,
        _rule_index: usize,
        pred_index: usize,
    ) -> Option<bool>
    where
        I: CharStream,
    {
        match LEXER_PRED.get(pred_index) {
            Some(PredKind::Const(b)) => Some(*b),
            Some(PredKind::Stateful(Stateful::InVersionComment)) => Some(self.in_version_comment),
            Some(PredKind::Stateful(Stateful::CheckMysqlVersion)) => {
                Some(self.check_mysql_version(&ctx.text_so_far()))
            }
            Some(PredKind::Unreachable) | None => None,
        }
    }

    // ---- Lexer custom actions ----
    fn lexer_action<I>(&mut self, ctx: &mut LexerSemCtx<'_, I>, action: LexerCustomAction) -> bool
    where
        I: CharStream,
    {
        let Some(kind) = LEXER_ACTION.get(action.action_index() as usize) else {
            return false;
        };
        match *kind {
            ActionKind::DetermineFunction(proposed) => {
                let t = self.determine_function(ctx, proposed);
                ctx.set_type(t);
            }
            ActionKind::DetermineNumericType => {
                let t = determine_numeric_type(&ctx.text_so_far());
                ctx.set_type(t);
            }
            ActionKind::EmitDot => {
                // Queue a standalone DOT_SYMBOL for the leading '.', then advance
                // the token start so the automatic emission covers only the
                // identifier suffix (C++: _pendingTokens.emplace_back + ++tokenStartCharIndex).
                let start = ctx.token_start();
                ctx.enqueue_token(lex::DOT_SYMBOL, start);
                ctx.set_token_start(start + 1);
            }
            ActionKind::CheckCharset => {
                let t = check_charset(&ctx.text_so_far());
                ctx.set_type(t);
            }
            ActionKind::PipesOr => {
                let t = if self.is_sql_mode_active(sql_mode::PIPES_AS_CONCAT) {
                    lex::CONCAT_PIPES_SYMBOL
                } else {
                    lex::LOGICAL_OR_OPERATOR
                };
                ctx.set_type(t);
            }
            ActionKind::HighNotPrec => {
                let t = if self.is_sql_mode_active(sql_mode::HIGH_NOT_PRECEDENCE) {
                    lex::NOT2_SYMBOL
                } else {
                    lex::NOT_SYMBOL
                };
                ctx.set_type(t);
            }
            ActionKind::EnterVersionComment => self.in_version_comment = true,
            ActionKind::ExitVersionComment => self.in_version_comment = false,
        }
        true
    }

    /// Clears version-comment state when the lexer is reset for reuse, matching
    /// `MySQLBaseLexer::reset()` (which sets `inVersionComment = false`). Without
    /// this, an executable comment left open by one statement (e.g. `/*!01000...`)
    /// would leak into the next statement when the long-lived lexer is re-fed.
    fn lexer_reset<I>(&mut self, _ctx: &mut LexerLifecycleCtx<'_, I>)
    where
        I: CharStream,
    {
        self.in_version_comment = false;
    }
}

impl MySqlHooks {
    /// `MySQLBaseLexer::determineFunction` — a function-name keyword keeps its
    /// type only if immediately followed by `(` (optionally skipping whitespace
    /// under IgnoreSpace); otherwise it degrades to `IDENTIFIER`.
    ///
    /// Under `ANSI_QUOTES` alone, `IgnoreSpace` is inactive so the whitespace
    /// loop never runs, but it is retained for faithfulness at other modes.
    /// The C++ whitespace-skip path also `consume()`s the spaces and emits them
    /// on the hidden channel; that is preserved here for mode fidelity.
    #[inline]
    fn determine_function<I: CharStream>(&self, ctx: &mut LexerSemCtx<'_, I>, proposed: i32) -> i32 {
        if self.is_sql_mode_active(sql_mode::IGNORE_SPACE) {
            while matches!(ctx.la(1), 0x20 | 0x09 | 0x0D | 0x0A) {
                ctx.consume();
                ctx.set_channel(HIDDEN_CHANNEL);
                ctx.set_type(lex::WHITESPACE);
            }
        }
        if ctx.la(1) == i32::from(b'(') {
            proposed
        } else {
            lex::IDENTIFIER
        }
    }

    /// `MySQLBaseLexer::checkMySQLVersion` — for a `/*!NNNNN` version comment
    /// introducer, enter version-comment mode iff `NNNNN <= serverVersion`.
    ///
    /// C++: `if (text.size() < 8) return false;` then
    /// `long version = stoul(text + 3); if (version <= serverVersion) { inVersionComment = true; return true; }`.
    fn check_mysql_version(&mut self, text: &str) -> bool {
        let bytes = text.as_bytes();
        if bytes.len() < 8 {
            // Minimum is "/*!12345".
            return false;
        }
        // Skip the "/*!" introducer, read the leading run of digits.
        let digits: u32 = bytes[3..]
            .iter()
            .take_while(|b| b.is_ascii_digit())
            .fold(0u32, |acc, b| acc.saturating_mul(10).saturating_add(u32::from(b - b'0')));
        if digits <= self.server_version {
            self.in_version_comment = true;
            true
        } else {
            false
        }
    }
}

/// `MySQLBaseLexer::checkCharset` — `_charset` introducer vs identifier.
#[inline]
fn check_charset(text: &str) -> i32 {
    if CHARSETS.contains(&text) {
        lex::UNDERSCORE_CHARSET
    } else {
        lex::IDENTIFIER
    }
}

/// The 40 recognised charset introducers, matching the reference targets'
/// `charSets` set (`ParseService.cpp` / `ParseService.ts`) exactly.
static CHARSETS: [&str; 40] = [
    "_big5", "_dec8", "_cp850", "_hp8", "_koi8r", "_latin1", "_latin2", "_swe7", "_ascii",
    "_ujis", "_sjis", "_hebrew", "_tis620", "_euckr", "_koi8u", "_gb18030", "_gb2312", "_greek",
    "_cp1250", "_gbk", "_latin5", "_armscii8", "_utf8", "_ucs2", "_cp866", "_keybcs2", "_macce",
    "_macroman", "_cp852", "_latin7", "_utf8mb4", "_cp1251", "_utf16", "_cp1256", "_cp1257",
    "_utf32", "_binary", "_geostd8", "_cp932", "_eucjpms",
];

/// `MySQLBaseLexer::determineNumericType` — classify an integer literal by
/// magnitude into INT / LONG / ULONGLONG / DECIMAL.
///
/// Direct port of the C++/TS reference, including the intentional
/// `length = text.size() - 1` quirk (present verbatim in both references — the
/// original author's comment notes it can never see a sign, so the count is off
/// by one but the thresholds are calibrated to match).
fn determine_numeric_type(text: &str) -> i32 {
    const LONG_STR: &[u8] = b"2147483647";
    const LONG_LEN: usize = 10;
    const SIGNED_LONG_STR: &[u8] = b"2147483648"; // signed_long_str + 1 (sign stripped)
    const LONGLONG_STR: &[u8] = b"9223372036854775807";
    const LONGLONG_LEN: usize = 19;
    const SIGNED_LONGLONG_STR: &[u8] = b"9223372036854775808"; // signed_longlong_str + 1
    const SIGNED_LONGLONG_LEN: usize = 19;
    const UNSIGNED_LONGLONG_STR: &[u8] = b"18446744073709551615";
    const UNSIGNED_LONGLONG_LEN: usize = 20;

    let bytes = text.as_bytes();
    // Faithful quirk: C++ `unsigned length = text.size() - 1;`
    let mut length = bytes.len().wrapping_sub(1);
    if length < LONG_LEN {
        return lex::INT_NUMBER; // quick normal case
    }

    let mut idx = 0usize;
    let mut negative = false;
    match bytes.first() {
        Some(b'+') => {
            idx += 1;
            length -= 1;
        }
        Some(b'-') => {
            idx += 1;
            length -= 1;
            negative = true;
        }
        _ => {}
    }
    // Strip leading zeros.
    while length > 0 && bytes.get(idx) == Some(&b'0') {
        idx += 1;
        length -= 1;
    }
    if length < LONG_LEN {
        return lex::INT_NUMBER;
    }

    let (cmp, smaller, bigger): (&[u8], i32, i32) = if negative {
        if length == LONG_LEN {
            (SIGNED_LONG_STR, lex::INT_NUMBER, lex::LONG_NUMBER)
        } else if length < SIGNED_LONGLONG_LEN {
            return lex::LONG_NUMBER;
        } else if length > SIGNED_LONGLONG_LEN {
            return lex::DECIMAL_NUMBER;
        } else {
            (SIGNED_LONGLONG_STR, lex::LONG_NUMBER, lex::DECIMAL_NUMBER)
        }
    } else if length == LONG_LEN {
        (LONG_STR, lex::INT_NUMBER, lex::LONG_NUMBER)
    } else if length < LONGLONG_LEN {
        return lex::LONG_NUMBER;
    } else if length > LONGLONG_LEN {
        if length > UNSIGNED_LONGLONG_LEN {
            return lex::DECIMAL_NUMBER;
        }
        (UNSIGNED_LONGLONG_STR, lex::ULONGLONG_NUMBER, lex::DECIMAL_NUMBER)
    } else {
        (LONGLONG_STR, lex::LONG_NUMBER, lex::ULONGLONG_NUMBER)
    };

    // C++: while (*cmp && *cmp++ == *str++) ; return (str[-1] <= cmp[-1]) ? smaller : bigger;
    // i.e. lexicographic compare of equal-length decimal strings.
    let digits = &bytes[idx..];
    let n = cmp.len().min(digits.len());
    let mut i = 0;
    while i < n && cmp[i] == digits[i] {
        i += 1;
    }
    let last_str = if i < digits.len() { digits[i] } else { *digits.last().unwrap_or(&0) };
    let last_cmp = if i < cmp.len() { cmp[i] } else { *cmp.last().unwrap_or(&0) };
    if last_str <= last_cmp {
        smaller
    } else {
        bigger
    }
}
