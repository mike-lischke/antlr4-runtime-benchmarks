package misc;

import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.ATNConfigSet;
import org.antlr.v4.runtime.dfa.DFA;

import java.util.BitSet;
import java.util.List;

public class SimpleErrorListener implements ANTLRErrorListener {

    private List<ParserErrorInfo> errors;

    public SimpleErrorListener(List<ParserErrorInfo> errors) {
        this.errors = errors;
    }

    @Override
    public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol, int line, int column, String message, RecognitionException e) {
        Token token = offendingSymbol instanceof Token ? (Token) offendingSymbol : null;
        int tokenType = token == null ? 0 : token.getType();
        int charOffset = token == null ? 0 : token.getStartIndex();
        int length = token == null ? 0 : token.getStopIndex() - token.getStartIndex() + 1;

        this.errors.add(new ParserErrorInfo(message, tokenType, charOffset, line, column, length));
    }

    @Override
    public void reportAmbiguity(Parser parser, DFA dfa, int i, int i1, boolean b, BitSet bitSet, ATNConfigSet atnConfigSet) {
    }

    @Override
    public void reportAttemptingFullContext(Parser parser, DFA dfa, int i, int i1, BitSet bitSet, ATNConfigSet atnConfigSet) {
    }

    @Override
    public void reportContextSensitivity(Parser parser, DFA dfa, int i, int i1, int i2, ATNConfigSet atnConfigSet) {
    }
}
