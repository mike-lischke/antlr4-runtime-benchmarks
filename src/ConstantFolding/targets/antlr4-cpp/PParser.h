
// Generated from ./targets/P.g4 by ANTLR 4.13.1

#pragma once


#include "antlr4-runtime.h"


namespace parsers {


class  PParser : public antlr4::Parser {
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

  enum {
    RuleR = 0, RuleT = 1
  };

  explicit PParser(antlr4::TokenStream *input);

  PParser(antlr4::TokenStream *input, const antlr4::atn::ParserATNSimulatorOptions &options);

  ~PParser() override;

  std::string getGrammarFileName() const override;

  const antlr4::atn::ATN& getATN() const override;

  const std::vector<std::string>& getRuleNames() const override;

  const antlr4::dfa::Vocabulary& getVocabulary() const override;

  antlr4::atn::SerializedATNView getSerializedATN() const override;


  class RContext;
  class TContext; 

  class  RContext : public antlr4::ParserRuleContext {
  public:
    RContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *EOF();
    std::vector<TContext *> t();
    TContext* t(size_t i);

   
  };

  RContext* r();

  class  TContext : public antlr4::ParserRuleContext {
  public:
    TContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *T0();
    antlr4::tree::TerminalNode *T1();
    antlr4::tree::TerminalNode *T2();
    antlr4::tree::TerminalNode *T3();
    antlr4::tree::TerminalNode *T4();
    antlr4::tree::TerminalNode *T5();
    antlr4::tree::TerminalNode *T6();
    antlr4::tree::TerminalNode *T7();
    antlr4::tree::TerminalNode *T8();
    antlr4::tree::TerminalNode *T9();
    antlr4::tree::TerminalNode *T10();
    antlr4::tree::TerminalNode *T11();
    antlr4::tree::TerminalNode *T12();
    antlr4::tree::TerminalNode *T13();
    antlr4::tree::TerminalNode *T14();
    antlr4::tree::TerminalNode *T15();
    antlr4::tree::TerminalNode *T16();
    antlr4::tree::TerminalNode *T17();
    antlr4::tree::TerminalNode *T18();
    antlr4::tree::TerminalNode *T19();
    antlr4::tree::TerminalNode *T20();
    antlr4::tree::TerminalNode *T21();
    antlr4::tree::TerminalNode *T22();
    antlr4::tree::TerminalNode *T23();
    antlr4::tree::TerminalNode *T24();
    antlr4::tree::TerminalNode *T25();
    antlr4::tree::TerminalNode *T26();
    antlr4::tree::TerminalNode *T27();
    antlr4::tree::TerminalNode *T28();
    antlr4::tree::TerminalNode *T29();
    antlr4::tree::TerminalNode *T30();
    antlr4::tree::TerminalNode *T31();
    antlr4::tree::TerminalNode *T32();
    antlr4::tree::TerminalNode *T33();
    antlr4::tree::TerminalNode *T34();
    antlr4::tree::TerminalNode *T35();
    antlr4::tree::TerminalNode *T36();
    antlr4::tree::TerminalNode *T37();
    antlr4::tree::TerminalNode *T38();
    antlr4::tree::TerminalNode *T39();
    antlr4::tree::TerminalNode *T40();
    antlr4::tree::TerminalNode *T41();
    antlr4::tree::TerminalNode *T42();
    antlr4::tree::TerminalNode *T43();
    antlr4::tree::TerminalNode *T44();
    antlr4::tree::TerminalNode *T45();
    antlr4::tree::TerminalNode *T46();
    antlr4::tree::TerminalNode *T47();
    antlr4::tree::TerminalNode *T48();
    antlr4::tree::TerminalNode *T49();
    antlr4::tree::TerminalNode *T50();
    antlr4::tree::TerminalNode *T51();
    antlr4::tree::TerminalNode *T52();
    antlr4::tree::TerminalNode *T53();
    antlr4::tree::TerminalNode *T54();
    antlr4::tree::TerminalNode *T55();
    antlr4::tree::TerminalNode *T56();
    antlr4::tree::TerminalNode *T57();
    antlr4::tree::TerminalNode *T58();
    antlr4::tree::TerminalNode *T59();
    antlr4::tree::TerminalNode *T60();
    antlr4::tree::TerminalNode *T61();
    antlr4::tree::TerminalNode *T62();
    antlr4::tree::TerminalNode *T63();

   
  };

  TContext* t();


  // By default the static state used to implement the parser is lazily initialized during the first
  // call to the constructor. You can call this function if you wish to initialize the static state
  // ahead of time.
  static void initialize();

private:
};

}  // namespace parsers
