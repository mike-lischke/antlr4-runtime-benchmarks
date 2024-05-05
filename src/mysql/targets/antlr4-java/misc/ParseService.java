package misc;

import org.antlr.v4.runtime.CharStreams;
import parsers.MySQLLexer;

import java.util.List;

public interface ParseService {
    void tokenize(String text, int serverVersion, String sqlMode);
    boolean errorCheck();
    List<ParserErrorInfo> errorsWithOffset(int offset);
    void clearDFA();
}
