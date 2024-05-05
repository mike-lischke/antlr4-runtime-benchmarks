package misc;

import org.antlr.v4.runtime.BailErrorStrategy;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.atn.PredictionMode;
import parsers.MySQLLexer;
import parsers.MySQLParser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

public class ParseServiceImpl implements ParseService {

    private final static String[] charSets = {
        "_big5", "_dec8", "_cp850", "_hp8", "_koi8r", "_latin1", "_latin2", "_swe7", "_ascii", "_ujis",
        "_sjis", "_hebrew", "_tis620", "_euckr", "_koi8u", "_gb18030", "_gb2312", "_greek", "_cp1250", "_gbk",
        "_latin5", "_armscii8", "_utf8", "_ucs2", "_cp866", "_keybcs2", "_macce", "_macroman", "_cp852", "_latin7",
        "_cp1251", "_cp1256", "_cp1257", "_binary", "_geostd8", "_cp932", "_eucjpms", "_utf8mb4", "_utf16", "_utf32"
    };

    private MySQLLexer lexer;
    private CommonTokenStream tokenStream;
    private  MySQLParser parser;
    private List<ParserErrorInfo> errors = new ArrayList<>();
    private String sql = "";

    public ParseServiceImpl() {
        this.lexer = new MySQLLexer(CharStreams.fromString(this.sql));
        this.tokenStream = new CommonTokenStream(this.lexer);
        this.parser = new MySQLParser(this.tokenStream);

        SimpleErrorListener errorListener = new SimpleErrorListener(this.errors);

        this.lexer.charSets = new HashSet<>(Arrays.asList(charSets));
        this.lexer.removeErrorListeners();
        this.lexer.addErrorListener(errorListener);

        this.parser.removeParseListeners();
        this.parser.removeErrorListeners();
        this.parser.addErrorListener(errorListener);
        this.parser.setErrorHandler(new BailErrorStrategy());
        this.parser.getInterpreter().setPredictionMode(PredictionMode.SLL);
        this.parser.setBuildParseTree(false);
    }

    @Override
    public void tokenize(String text, int serverVersion, String sqlMode) {
        this.sql = text.trim();

        // ---------------- without this there are exceptions ------------------
        this.lexer = new MySQLLexer(CharStreams.fromString(this.sql));
        this.tokenStream = new CommonTokenStream(this.lexer);
        // ---------------------------------------------------------------------

        // this.lexer.setInputStream(CharStreams.fromString(this.sql));
        // this.tokenStream.setTokenSource(this.lexer);

        this.lexer.serverVersion = serverVersion;
        this.lexer.sqlModeFromString(sqlMode);
        this.tokenStream.fill();
    }

    @Override
    public boolean errorCheck() {
        this.startParsing();
        return this.errors.size() == 0;
    }

    @Override
    public List<ParserErrorInfo> errorsWithOffset(int offset) {
        List<ParserErrorInfo> result = new ArrayList<>(this.errors);

        for (ParserErrorInfo error : result) {
            error.charOffset += offset;
        }

        return result;
    }

    @Override
    public void clearDFA() {
        this.lexer.getInterpreter().clearDFA();
        this.parser.getInterpreter().clearDFA();
    }

    private void startParsing() {
        try {
            // ---------------- without this there are exceptions ------------------
            this.parser = new MySQLParser(this.tokenStream);
            // ---------------------------------------------------------------------

            this.errors = new ArrayList<>();
            this.parser.reset();
            this.parser.serverVersion = this.lexer.serverVersion;
            this.parser.sqlModes = this.lexer.sqlModes;
            this.parser.query();
        }
        catch (Exception e) {
            throw new RuntimeException("Failed: `" + this.sql + "`: " + e.getMessage() + " (" + e.getClass().getName() + ")");
        }
    }
}
