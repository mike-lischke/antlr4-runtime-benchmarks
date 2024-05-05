package misc;

public class ParserErrorInfo {

    public String message;
    public int tokenType;
    public int charOffset;
    public int line;
    public int column;
    public int length;

    public ParserErrorInfo(String message, int tokenType, int charOffset, int line, int column, int length) {
        this.message = message;
        this.tokenType = tokenType;
        this.charOffset = charOffset;
        this.line = line;
        this.column = column;
        this.length = length;
    }
}
