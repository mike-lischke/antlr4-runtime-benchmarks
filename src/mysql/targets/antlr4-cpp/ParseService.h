
#pragma once

#include <string>
#include <vector>

#include "antlr4-runtime.h"
#include "MySQLLexer.h"
#include "MySQLParser.h"

class TestErrorListener : public antlr4::BaseErrorListener {
public:
  std::string lastErrors;

  virtual void syntaxError(antlr4::Recognizer *recognizer, antlr4::Token *offendingSymbol, size_t line,
                           size_t charPositionInLine, const std::string &msg,
                           std::exception_ptr e) override {
    if (!lastErrors.empty())
      lastErrors += "\n";
    lastErrors += "line " + std::to_string(line) + ":" + std::to_string(charPositionInLine) + " " + msg;
  }
};

class ParseServiceCpp {
public:
  ParseServiceCpp(size_t serverVersion);

  void tokenize(const std::string &text);
  bool errorCheck();
  void clearDFA();

private:
  antlr4::ANTLRInputStream input;
  parsers::MySQLLexer lexer;
  antlr4::CommonTokenStream tokens;
  parsers::MySQLParser parser;

  TestErrorListener errorListener;

  Ref<antlr4::BailErrorStrategy> bailOutErrorStrategy = std::make_shared<antlr4::BailErrorStrategy>();
  Ref<antlr4::DefaultErrorStrategy> defaultErrorStrategy = std::make_shared<antlr4::DefaultErrorStrategy>();

  antlr4::tree::ParseTree *startParsing(bool fast);
};
