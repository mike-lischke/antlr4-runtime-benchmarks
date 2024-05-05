package parsers;

import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.Token;
import java.util.*;

public abstract class MySQLBaseLexer extends Lexer {

    public int serverVersion = 0;
    public Set<SqlMode> sqlModes = new HashSet<>();
    public Set<String> charSets = new HashSet<>();
    protected boolean inVersionComment = false;

    protected boolean supportMle = false;

    private Queue<Token> pendingTokens = new ArrayDeque<>();
    private Map<String, Integer> symbols = new HashMap<>(); // A list of all defined symbols for lookup.

    public MySQLBaseLexer(CharStream input) {
        super(input);
    }

    @Override
    public void reset() {
        this.inVersionComment = false;
        super.reset();
    }

    @Override
    public Token nextToken() {
        if (this.pendingTokens.size() > 0) {
            return this.pendingTokens.poll();
        }
        return super.nextToken();
    }

    public static boolean isRelation(int type) {
        return switch (type) {
            case MySQLLexer.EQUAL_OPERATOR, MySQLLexer.ASSIGN_OPERATOR, MySQLLexer.NULL_SAFE_EQUAL_OPERATOR,
                    MySQLLexer.GREATER_OR_EQUAL_OPERATOR, MySQLLexer.GREATER_THAN_OPERATOR, MySQLLexer.LESS_OR_EQUAL_OPERATOR,
                    MySQLLexer.LESS_THAN_OPERATOR, MySQLLexer.NOT_EQUAL_OPERATOR, MySQLLexer.NOT_EQUAL2_OPERATOR,
                    MySQLLexer.PLUS_OPERATOR, MySQLLexer.MINUS_OPERATOR, MySQLLexer.MULT_OPERATOR, MySQLLexer.DIV_OPERATOR,
                    MySQLLexer.MOD_OPERATOR, MySQLLexer.LOGICAL_NOT_OPERATOR, MySQLLexer.BITWISE_NOT_OPERATOR,
                    MySQLLexer.SHIFT_LEFT_OPERATOR, MySQLLexer.SHIFT_RIGHT_OPERATOR, MySQLLexer.LOGICAL_AND_OPERATOR,
                    MySQLLexer.BITWISE_AND_OPERATOR, MySQLLexer.BITWISE_XOR_OPERATOR, MySQLLexer.LOGICAL_OR_OPERATOR,
                    MySQLLexer.BITWISE_OR_OPERATOR, MySQLLexer.OR_SYMBOL, MySQLLexer.XOR_SYMBOL, MySQLLexer.AND_SYMBOL,
                    MySQLLexer.IS_SYMBOL, MySQLLexer.BETWEEN_SYMBOL, MySQLLexer.LIKE_SYMBOL, MySQLLexer.REGEXP_SYMBOL,
                    MySQLLexer.IN_SYMBOL, MySQLLexer.SOUNDS_SYMBOL, MySQLLexer.NOT_SYMBOL -> true;
            default -> false;
        };
    }

    public boolean isNumber(int type) {
        return switch (type) {
            case MySQLLexer.INT_NUMBER, MySQLLexer.LONG_NUMBER, MySQLLexer.ULONGLONG_NUMBER, MySQLLexer.FLOAT_NUMBER,
                    MySQLLexer.HEX_NUMBER, MySQLLexer.BIN_NUMBER, MySQLLexer.DECIMAL_NUMBER -> true;
            default -> false;
        };
    }

    public boolean isDelimiter(int type) {
        return switch (type) {
            case MySQLLexer.DOT_SYMBOL, MySQLLexer.COMMA_SYMBOL, MySQLLexer.SEMICOLON_SYMBOL, MySQLLexer.COLON_SYMBOL -> true;
            default -> false;
        };
    }

    public boolean isOperator(int type) {
        return switch (type) {
            case MySQLLexer.EQUAL_OPERATOR, MySQLLexer.ASSIGN_OPERATOR, MySQLLexer.NULL_SAFE_EQUAL_OPERATOR,
                    MySQLLexer.GREATER_OR_EQUAL_OPERATOR, MySQLLexer.GREATER_THAN_OPERATOR, MySQLLexer.LESS_OR_EQUAL_OPERATOR,
                    MySQLLexer.LESS_THAN_OPERATOR, MySQLLexer.NOT_EQUAL_OPERATOR, MySQLLexer.NOT_EQUAL2_OPERATOR,
                    MySQLLexer.PLUS_OPERATOR, MySQLLexer.MINUS_OPERATOR, MySQLLexer.MULT_OPERATOR, MySQLLexer.DIV_OPERATOR,
                    MySQLLexer.MOD_OPERATOR, MySQLLexer.LOGICAL_NOT_OPERATOR, MySQLLexer.BITWISE_NOT_OPERATOR,
                    MySQLLexer.SHIFT_LEFT_OPERATOR, MySQLLexer.SHIFT_RIGHT_OPERATOR, MySQLLexer.LOGICAL_AND_OPERATOR,
                    MySQLLexer.BITWISE_AND_OPERATOR, MySQLLexer.BITWISE_XOR_OPERATOR, MySQLLexer.LOGICAL_OR_OPERATOR,
                    MySQLLexer.BITWISE_OR_OPERATOR, MySQLLexer.OPEN_PAR_SYMBOL, MySQLLexer.CLOSE_PAR_SYMBOL,
                    MySQLLexer.AT_SIGN_SYMBOL, MySQLLexer.AT_AT_SIGN_SYMBOL, MySQLLexer.PARAM_MARKER, MySQLLexer.ALL_SYMBOL,
                    MySQLLexer.AND_SYMBOL, MySQLLexer.ANY_SYMBOL, MySQLLexer.BETWEEN_SYMBOL, MySQLLexer.EXISTS_SYMBOL,
                    MySQLLexer.IN_SYMBOL, MySQLLexer.LIKE_SYMBOL, MySQLLexer.NOT_SYMBOL, MySQLLexer.OR_SYMBOL,
                    MySQLLexer.EXCEPT_SYMBOL, MySQLLexer.INTERSECT_SYMBOL, MySQLLexer.UNION_SYMBOL, MySQLLexer.CROSS_SYMBOL,
                    MySQLLexer.FULL_SYMBOL, MySQLLexer.INNER_SYMBOL, MySQLLexer.JOIN_SYMBOL, MySQLLexer.LEFT_SYMBOL,
                    MySQLLexer.NATURAL_SYMBOL, MySQLLexer.OUTER_SYMBOL, MySQLLexer.RIGHT_SYMBOL, MySQLLexer.STRAIGHT_JOIN_SYMBOL,
                    MySQLLexer.CONTAINS_SYMBOL, MySQLLexer.IS_SYMBOL, MySQLLexer.NULL_SYMBOL -> true;
            default -> false;
        };
    }

    public boolean isSqlModeActive(SqlMode mode) {
        return this.sqlModes.contains(mode);
    }

    public void sqlModeFromString(String modes) {
        this.sqlModes = new HashSet<>();

        for (String mode : modes.toUpperCase().split(",")) {
            switch (mode) {
                case "ANSI", "DB2", "MAXDB", "MSSQL", "ORACLE", "POSTGRESQL" -> {
                    this.sqlModes.add(SqlMode.AnsiQuotes);
                    this.sqlModes.add(SqlMode.PipesAsConcat);
                    this.sqlModes.add(SqlMode.IgnoreSpace);
                }
                case "ANSI_QUOTES" -> this.sqlModes.add(SqlMode.AnsiQuotes);
                case "PIPES_AS_CONCAT" -> this.sqlModes.add(SqlMode.PipesAsConcat);
                case "NO_BACKSLASH_ESCAPES" -> this.sqlModes.add(SqlMode.NoBackslashEscapes);
                case "IGNORE_SPACE" -> this.sqlModes.add(SqlMode.IgnoreSpace);
                case "HIGH_NOT_PRECEDENCE", "MYSQL323", "MYSQL40" -> this.sqlModes.add(SqlMode.HighNotPrecedence);
                default -> throw new RuntimeException("Unmapped mode: '" + mode + "'");
            }
        }
    }

    protected boolean checkMySQLVersion(String text) {
        return checkVersion(text);
    }

    public boolean checkVersion(String text) {
        if (text.length() < 8) { // Minimum is: /*!12345
            return false;
        }

        // Skip version comment introducer.
        int version = Integer.parseInt(text.substring(3), 10);

        if (version <= this.serverVersion) {
            this.inVersionComment = true;
            return true;
        }

        return false;
    }

    protected int determineFunction(int proposed) {
        // Skip any whitespace character if the sql mode says they should be ignored,
        // before actually trying to match the open parenthesis.
        char input = (char) this._input.LA(1);

        if (this.isSqlModeActive(SqlMode.IgnoreSpace)) {
            while (input == ' ' || input == '\t' || input == '\r' || input == '\n') {
                this.getInterpreter().consume(this._input);
                this._channel = Lexer.HIDDEN;
                this._type = MySQLLexer.WHITESPACE;
                input = (char) this._input.LA(1);
            }
        }

        return input == '(' ? proposed : MySQLLexer.IDENTIFIER;
    }

    protected int determineNumericType(String text) {

        final String longString = "2147483647";
        final int longLength = 10;
        final String signedLongString = "-2147483648";
        final String longLongString = "9223372036854775807";
        final int longLongLength = 19;
        final String signedLongLongString = "-9223372036854775808";
        final int signedLongLongLength = 19;
        final String unsignedLongLongString = "18446744073709551615";
        final int unsignedLongLongLength = 20;

        // The original code checks for leading +/- but actually that can never happen, neither in the
        // server parser (as a digit is used to trigger processing in the lexer) nor in our parser
        // as our rules are defined without signs. But we do it anyway for maximum compatibility.
        int length = text.length() - 1;
        if (length < longLength) { // quick normal case
            return MySQLLexer.INT_NUMBER;
        }

        boolean negative = false;
        int index = 0;
        if (text.charAt(index) == '+') { // Remove sign and pre-zeros
            ++index;
            --length;
        } else if (text.charAt(index) == '-') {
            ++index;
            --length;
            negative = true;
        }

        while (text.charAt(index) == '0' && length > 0) {
            ++index;
            --length;
        }

        if (length < longLength) {
            return MySQLLexer.INT_NUMBER;
        }

        int smaller;
        int bigger;
        String cmp;

        if (negative) {
            if (length == longLength) {
                cmp = signedLongString.substring(1);
                smaller = MySQLLexer.INT_NUMBER; // If <= signed_long_str
                bigger = MySQLLexer.LONG_NUMBER; // If >= signed_long_str
            } else if (length < signedLongLongLength) {
                return MySQLLexer.LONG_NUMBER;
            } else if (length > signedLongLongLength) {
                return MySQLLexer.DECIMAL_NUMBER;
            } else {
                cmp = signedLongLongString.substring(1);
                smaller = MySQLLexer.LONG_NUMBER; // If <= signed_longlong_str
                bigger = MySQLLexer.DECIMAL_NUMBER;
            }
        } else {
            if (length == longLength) {
                cmp = longString;
                smaller = MySQLLexer.INT_NUMBER;
                bigger = MySQLLexer.LONG_NUMBER;
            } else if (length < longLongLength) {
                return MySQLLexer.LONG_NUMBER;
            } else if (length > longLongLength) {
                if (length > unsignedLongLongLength) {
                    return MySQLLexer.DECIMAL_NUMBER;
                }
                cmp = unsignedLongLongString;
                smaller = MySQLLexer.ULONGLONG_NUMBER;
                bigger = MySQLLexer.DECIMAL_NUMBER;
            } else {
                cmp = longLongString;
                smaller = MySQLLexer.LONG_NUMBER;
                bigger = MySQLLexer.ULONGLONG_NUMBER;
            }
        }

        int otherIndex = 0;
        while (index < text.length() && cmp.charAt(otherIndex++) == text.charAt(index++));

        return text.charAt(index - 1) <= cmp.charAt(otherIndex - 1) ? smaller : bigger;
    }

    protected int checkCharset(String text) {
        return this.charSets.contains(text) ? MySQLLexer.UNDERSCORE_CHARSET : MySQLLexer.IDENTIFIER;
    }

    protected void emitDot() {

        Token dot = this._factory.create(MySQLLexer.DOT_SYMBOL, this.getText());
        this.pendingTokens.offer(dot);

//        @ts-ignore
//        this.pendingTokens.push(this._factory.create([this, this._input], MySQLLexer.DOT_SYMBOL,
//                // @ts-ignore
//                this.text, this._channel, this._tokenStartCharIndex, this._tokenStartCharIndex, this._tokenStartLine,
//                this._tokenStartColumn,
//        ));

        ++this._tokenStartCharIndex;
    }
}