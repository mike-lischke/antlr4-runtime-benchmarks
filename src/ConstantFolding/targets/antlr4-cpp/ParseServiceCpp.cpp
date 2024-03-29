
/* cspell: disable */

#include <iostream>
#include <sstream>

#include "ParseServiceCpp.h"

using namespace antlr4;
using namespace antlr4::atn;
using namespace antlr4::tree;

ParseServiceCpp::ParseServiceCpp() : lexer(&input), tokens(&lexer), parser(&tokens) {
  lexer.removeErrorListeners();
  lexer.addErrorListener(&errorListener);

  parser.removeParseListeners();
  parser.removeErrorListeners();
  parser.addErrorListener(&errorListener);
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

  return errors.empty();
}

void ParseServiceCpp::clearDFA() {
  lexer.getInterpreter<LexerATNSimulator>()->clearDFA();
  parser.getInterpreter<ParserATNSimulator>()->clearDFA();
}

ParseTree *ParseServiceCpp::startParsing(bool fast) {
  errors.clear();
  parser.reset();
  parser.setTokenStream(&tokens);
  parser.setBuildParseTree(!fast);

  // First parse with the bail error strategy to get quick feedback for correct queries.
  parser.setErrorHandler(bailOutErrorStrategy);
  parser.getInterpreter<ParserATNSimulator>()->setPredictionMode(PredictionMode::SLL);

  ParseTree *tree;
  try {
    tree = parser.r();
  } catch (ParseCancellationException &) {
    if (fast && !errors.empty())
      tree = nullptr;
    else {
      tokens.reset();
      parser.reset();
      errors.clear();
      parser.setErrorHandler(defaultErrorStrategy);
      parser.getInterpreter<ParserATNSimulator>()->setPredictionMode(PredictionMode::LL);
      tree = parser.r();
    }
  }

  return tree;
}
