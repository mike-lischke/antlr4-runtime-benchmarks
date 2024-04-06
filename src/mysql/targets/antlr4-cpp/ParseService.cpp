
/* cspell: disable */

#include <iostream>
#include <sstream>

#include "ParseService.h"

using namespace antlr4;
using namespace antlr4::atn;
using namespace antlr4::tree;

static std::set<std::string> charSets{
  "_big5",   "_dec8",     "_cp850",  "_hp8",    "_koi8r",   "_latin1",  "_latin2",  "_swe7",     "_ascii",  "_ujis",
  "_sjis",   "_hebrew",   "_tis620", "_euckr",  "_koi8u",   "_gb18030", "_gb2312",  "_greek",    "_cp1250", "_gbk",
  "_latin5", "_armscii8", "_utf8",   "_ucs2",   "_cp866",   "_keybcs2", "_macce",   "_macroman", "_cp852",  "_latin7",
  "_cp1251", "_cp1256",   "_cp1257", "_binary", "_geostd8", "_cp932",   "_eucjpms", "_utf8mb4",  "_utf16",  "_utf32"
};

ParseServiceCpp::ParseServiceCpp(size_t serverVersion) : lexer(&input), tokens(&lexer), parser(&tokens) {
  lexer.charsets = charSets;
  lexer.serverVersion = serverVersion;
  parser.serverVersion = serverVersion;

  lexer.removeErrorListeners();
  lexer.addErrorListener(&errorListener);

  parser.removeParseListeners();
  parser.removeErrorListeners();
  parser.addErrorListener(&errorListener);

  lexer.sqlModeFromString("ANSI_QUOTES");
  parser.sqlMode = lexer.sqlMode;
}

void ParseServiceCpp::tokenize(const std::string &text) {
  input.load(text);
  lexer.reset();
  lexer.setInputStream(&input); // Not just reset(), which only rewinds the current position.
  tokens.setTokenSource(&lexer);
  tokens.fill();
}

bool ParseServiceCpp::errorCheck() {
  startParsing(true);

  return errorListener.lastErrors.empty();
}

void ParseServiceCpp::clearDFA() {
  lexer.getInterpreter<LexerATNSimulator>()->clearDFA();
  parser.getInterpreter<ParserATNSimulator>()->clearDFA();
}

ParseTree *ParseServiceCpp::startParsing(bool fast) {
  errorListener.lastErrors = "";
  parser.reset();
  parser.setTokenStream(&tokens);
  parser.setBuildParseTree(!fast);

  // First parse with the bail error strategy to get quick feedback for correct queries.
  parser.setErrorHandler(bailOutErrorStrategy);
  parser.getInterpreter<ParserATNSimulator>()->setPredictionMode(PredictionMode::SLL);

  ParseTree *tree;
  try {
    tree = parser.query();
  } catch (ParseCancellationException &) {
    if (fast && !errorListener.lastErrors.empty()) {
      tree = nullptr;
    } else {
      tokens.reset();
      parser.reset();
      errorListener.lastErrors = "";
      parser.setErrorHandler(defaultErrorStrategy);
      parser.getInterpreter<ParserATNSimulator>()->setPredictionMode(PredictionMode::LL);
      tree = parser.query();
    }
  }

  return tree;
}
