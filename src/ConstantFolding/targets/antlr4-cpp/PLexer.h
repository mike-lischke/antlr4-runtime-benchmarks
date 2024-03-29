
// Generated from ./targets/P.g4 by ANTLR 4.13.1

#pragma once


#include "antlr4-runtime.h"


namespace parsers {


class  PLexer : public antlr4::Lexer {
public:
  enum {
    T0 = 1, T1 = 2, T2 = 3, T3 = 4, T4 = 5, T5 = 6, T6 = 7, T7 = 8, T8 = 9, 
    T9 = 10, T10 = 11, T11 = 12, T12 = 13, T13 = 14, T14 = 15, T15 = 16, 
    T16 = 17, T17 = 18, T18 = 19, T19 = 20, T20 = 21, T21 = 22, T22 = 23, 
    T23 = 24, T24 = 25, T25 = 26, T26 = 27, T27 = 28, T28 = 29, T29 = 30, 
    T30 = 31, T31 = 32, T32 = 33, T33 = 34, T34 = 35, T35 = 36, T36 = 37, 
    T37 = 38, T38 = 39, T39 = 40, T40 = 41, T41 = 42, T42 = 43, T43 = 44, 
    T44 = 45, T45 = 46, T46 = 47, T47 = 48, T48 = 49, T49 = 50, T50 = 51, 
    T51 = 52, T52 = 53, T53 = 54, T54 = 55, T55 = 56, T56 = 57, T57 = 58, 
    T58 = 59, T59 = 60, T60 = 61, T61 = 62, T62 = 63, T63 = 64, WS = 65
  };

  explicit PLexer(antlr4::CharStream *input);

  ~PLexer() override;


  std::string getGrammarFileName() const override;

  const std::vector<std::string>& getRuleNames() const override;

  const std::vector<std::string>& getChannelNames() const override;

  const std::vector<std::string>& getModeNames() const override;

  const antlr4::dfa::Vocabulary& getVocabulary() const override;

  antlr4::atn::SerializedATNView getSerializedATN() const override;

  const antlr4::atn::ATN& getATN() const override;

  // By default the static state used to implement the lexer is lazily initialized during the first
  // call to the constructor. You can call this function if you wish to initialize the static state
  // ahead of time.
  static void initialize();

private:

  // Individual action functions triggered by action() above.

  // Individual semantic predicate functions triggered by sempred() above.

};

}  // namespace parsers
