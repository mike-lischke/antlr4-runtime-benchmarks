package parsers;

import org.antlr.v4.runtime.Parser;
import org.antlr.v4.runtime.TokenStream;

import java.util.HashSet;
import java.util.Set;

public abstract class MySQLBaseRecognizer extends Parser {

    // To parameterize the parsing process.
    public int serverVersion = 0;
    public Set<SqlMode> sqlModes = new HashSet<>();

    protected boolean supportMle = false;

    public MySQLBaseRecognizer(TokenStream input) {
        super(input);
    }

    public boolean isSqlModeActive(SqlMode mode) {
        return this.sqlModes.contains(mode);
    }

    public void sqlModeFromString(String _modes) {
        throw new RuntimeException("sqlModeFromString not implemented");
    }
}
