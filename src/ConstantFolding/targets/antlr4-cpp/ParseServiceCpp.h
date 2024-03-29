
#pragma once

#include <string>
#include <vector>

#include "antlr4-runtime.h"
#include "PLexer.h"
#include "PParser.h"

struct ParserErrorInfo {
  std::string message;
  size_t tokenType;
  size_t charOffset; // Offset (in bytes) from the beginning of the input to the error position.
  size_t line;       // Error line.
  size_t offset;     // Byte offset in the error line to the error start position.
  size_t length;
};

class TestErrorListener : public antlr4::BaseErrorListener {
public:
  std::string lastErrors;

  virtual void syntaxError(antlr4::Recognizer *recognizer, antlr4::Token *offendingSymbol, size_t line,
                           size_t charPositionInLine, const std::string &msg,
                           std::exception_ptr e) override {
    // Here we use the message provided by the DefaultErrorStrategy class.
    if (!lastErrors.empty())
      lastErrors += "\n";
    lastErrors += "line " + std::to_string(line) + ":" + std::to_string(charPositionInLine) + " " + msg;
  }
};

class ParseServiceCpp {
public:
  ParseServiceCpp();

  void tokenize(const std::string &text);
  bool errorCheck();
  void clearDFA();

private:
  std::vector<ParserErrorInfo> errors;

  antlr4::ANTLRInputStream input;
  parsers::PLexer lexer;
  antlr4::CommonTokenStream tokens;
  parsers::PParser parser;

  TestErrorListener errorListener;

  Ref<antlr4::BailErrorStrategy> bailOutErrorStrategy = std::make_shared<antlr4::BailErrorStrategy>();
  Ref<antlr4::DefaultErrorStrategy> defaultErrorStrategy = std::make_shared<antlr4::DefaultErrorStrategy>();

  antlr4::tree::ParseTree *startParsing(bool fast);
};
