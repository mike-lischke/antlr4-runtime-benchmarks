
// Generated from ./targets/P.g4 by ANTLR 4.13.1



#include "PParser.h"


using namespace antlrcpp;
using namespace parsers;

using namespace antlr4;

namespace {

struct PParserStaticData final {
  PParserStaticData(std::vector<std::string> ruleNames,
                        std::vector<std::string> literalNames,
                        std::vector<std::string> symbolicNames)
      : ruleNames(std::move(ruleNames)), literalNames(std::move(literalNames)),
        symbolicNames(std::move(symbolicNames)),
        vocabulary(this->literalNames, this->symbolicNames) {}

  PParserStaticData(const PParserStaticData&) = delete;
  PParserStaticData(PParserStaticData&&) = delete;
  PParserStaticData& operator=(const PParserStaticData&) = delete;
  PParserStaticData& operator=(PParserStaticData&&) = delete;

  std::vector<antlr4::dfa::DFA> decisionToDFA;
  antlr4::atn::PredictionContextCache sharedContextCache;
  const std::vector<std::string> ruleNames;
  const std::vector<std::string> literalNames;
  const std::vector<std::string> symbolicNames;
  const antlr4::dfa::Vocabulary vocabulary;
  antlr4::atn::SerializedATNView serializedATN;
  std::unique_ptr<antlr4::atn::ATN> atn;
};

::antlr4::internal::OnceFlag pParserOnceFlag;
#if ANTLR4_USE_THREAD_LOCAL_CACHE
static thread_local
#endif
PParserStaticData *pParserStaticData = nullptr;

void pParserInitialize() {
#if ANTLR4_USE_THREAD_LOCAL_CACHE
  if (pParserStaticData != nullptr) {
    return;
  }
#else
  assert(pParserStaticData == nullptr);
#endif
  auto staticData = std::make_unique<PParserStaticData>(
    std::vector<std::string>{
      "r", "t"
    },
    std::vector<std::string>{
      "", "'T0'", "'T1'", "'T2'", "'T3'", "'T4'", "'T5'", "'T6'", "'T7'", 
      "'T8'", "'T9'", "'T10'", "'T11'", "'T12'", "'T13'", "'T14'", "'T15'", 
      "'T16'", "'T17'", "'T18'", "'T19'", "'T20'", "'T21'", "'T22'", "'T23'", 
      "'T24'", "'T25'", "'T26'", "'T27'", "'T28'", "'T29'", "'T30'", "'T31'", 
      "'T32'", "'T33'", "'T34'", "'T35'", "'T36'", "'T37'", "'T38'", "'T39'", 
      "'T40'", "'T41'", "'T42'", "'T43'", "'T44'", "'T45'", "'T46'", "'T47'", 
      "'T48'", "'T49'", "'T50'", "'T51'", "'T52'", "'T53'", "'T54'", "'T55'", 
      "'T56'", "'T57'", "'T58'", "'T59'", "'T60'", "'T61'", "'T62'", "'T63'"
    },
    std::vector<std::string>{
      "", "T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", 
      "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "T19", "T20", 
      "T21", "T22", "T23", "T24", "T25", "T26", "T27", "T28", "T29", "T30", 
      "T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38", "T39", "T40", 
      "T41", "T42", "T43", "T44", "T45", "T46", "T47", "T48", "T49", "T50", 
      "T51", "T52", "T53", "T54", "T55", "T56", "T57", "T58", "T59", "T60", 
      "T61", "T62", "T63", "WS"
    }
  );
  static const int32_t serializedATNSegment[] = {
  	4,1,65,14,2,0,7,0,2,1,7,1,1,0,4,0,6,8,0,11,0,12,0,7,1,0,1,0,1,1,1,1,1,
  	1,0,0,2,0,2,0,1,1,0,1,64,12,0,5,1,0,0,0,2,11,1,0,0,0,4,6,3,2,1,0,5,4,
  	1,0,0,0,6,7,1,0,0,0,7,5,1,0,0,0,7,8,1,0,0,0,8,9,1,0,0,0,9,10,5,0,0,1,
  	10,1,1,0,0,0,11,12,7,0,0,0,12,3,1,0,0,0,1,7
  };
  staticData->serializedATN = antlr4::atn::SerializedATNView(serializedATNSegment, sizeof(serializedATNSegment) / sizeof(serializedATNSegment[0]));

  antlr4::atn::ATNDeserializer deserializer;
  staticData->atn = deserializer.deserialize(staticData->serializedATN);

  const size_t count = staticData->atn->getNumberOfDecisions();
  staticData->decisionToDFA.reserve(count);
  for (size_t i = 0; i < count; i++) { 
    staticData->decisionToDFA.emplace_back(staticData->atn->getDecisionState(i), i);
  }
  pParserStaticData = staticData.release();
}

}

PParser::PParser(TokenStream *input) : PParser(input, antlr4::atn::ParserATNSimulatorOptions()) {}

PParser::PParser(TokenStream *input, const antlr4::atn::ParserATNSimulatorOptions &options) : Parser(input) {
  PParser::initialize();
  _interpreter = new atn::ParserATNSimulator(this, *pParserStaticData->atn, pParserStaticData->decisionToDFA, pParserStaticData->sharedContextCache, options);
}

PParser::~PParser() {
  delete _interpreter;
}

const atn::ATN& PParser::getATN() const {
  return *pParserStaticData->atn;
}

std::string PParser::getGrammarFileName() const {
  return "P.g4";
}

const std::vector<std::string>& PParser::getRuleNames() const {
  return pParserStaticData->ruleNames;
}

const dfa::Vocabulary& PParser::getVocabulary() const {
  return pParserStaticData->vocabulary;
}

antlr4::atn::SerializedATNView PParser::getSerializedATN() const {
  return pParserStaticData->serializedATN;
}


//----------------- RContext ------------------------------------------------------------------

PParser::RContext::RContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* PParser::RContext::EOF() {
  return getToken(PParser::EOF, 0);
}

std::vector<PParser::TContext *> PParser::RContext::t() {
  return getRuleContexts<PParser::TContext>();
}

PParser::TContext* PParser::RContext::t(size_t i) {
  return getRuleContext<PParser::TContext>(i);
}


size_t PParser::RContext::getRuleIndex() const {
  return PParser::RuleR;
}


PParser::RContext* PParser::r() {
  RContext *_localctx = _tracker.createInstance<RContext>(_ctx, getState());
  enterRule(_localctx, 0, PParser::RuleR);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(5); 
    _errHandler->sync(this);
    _la = _input->LA(1);
    do {
      setState(4);
      t();
      setState(7); 
      _errHandler->sync(this);
      _la = _input->LA(1);
    } while (((((_la - 1) & ~ 0x3fULL) == 0) &&
      ((1ULL << (_la - 1)) & -1) != 0));
    setState(9);
    match(PParser::EOF);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- TContext ------------------------------------------------------------------

PParser::TContext::TContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* PParser::TContext::T0() {
  return getToken(PParser::T0, 0);
}

tree::TerminalNode* PParser::TContext::T1() {
  return getToken(PParser::T1, 0);
}

tree::TerminalNode* PParser::TContext::T2() {
  return getToken(PParser::T2, 0);
}

tree::TerminalNode* PParser::TContext::T3() {
  return getToken(PParser::T3, 0);
}

tree::TerminalNode* PParser::TContext::T4() {
  return getToken(PParser::T4, 0);
}

tree::TerminalNode* PParser::TContext::T5() {
  return getToken(PParser::T5, 0);
}

tree::TerminalNode* PParser::TContext::T6() {
  return getToken(PParser::T6, 0);
}

tree::TerminalNode* PParser::TContext::T7() {
  return getToken(PParser::T7, 0);
}

tree::TerminalNode* PParser::TContext::T8() {
  return getToken(PParser::T8, 0);
}

tree::TerminalNode* PParser::TContext::T9() {
  return getToken(PParser::T9, 0);
}

tree::TerminalNode* PParser::TContext::T10() {
  return getToken(PParser::T10, 0);
}

tree::TerminalNode* PParser::TContext::T11() {
  return getToken(PParser::T11, 0);
}

tree::TerminalNode* PParser::TContext::T12() {
  return getToken(PParser::T12, 0);
}

tree::TerminalNode* PParser::TContext::T13() {
  return getToken(PParser::T13, 0);
}

tree::TerminalNode* PParser::TContext::T14() {
  return getToken(PParser::T14, 0);
}

tree::TerminalNode* PParser::TContext::T15() {
  return getToken(PParser::T15, 0);
}

tree::TerminalNode* PParser::TContext::T16() {
  return getToken(PParser::T16, 0);
}

tree::TerminalNode* PParser::TContext::T17() {
  return getToken(PParser::T17, 0);
}

tree::TerminalNode* PParser::TContext::T18() {
  return getToken(PParser::T18, 0);
}

tree::TerminalNode* PParser::TContext::T19() {
  return getToken(PParser::T19, 0);
}

tree::TerminalNode* PParser::TContext::T20() {
  return getToken(PParser::T20, 0);
}

tree::TerminalNode* PParser::TContext::T21() {
  return getToken(PParser::T21, 0);
}

tree::TerminalNode* PParser::TContext::T22() {
  return getToken(PParser::T22, 0);
}

tree::TerminalNode* PParser::TContext::T23() {
  return getToken(PParser::T23, 0);
}

tree::TerminalNode* PParser::TContext::T24() {
  return getToken(PParser::T24, 0);
}

tree::TerminalNode* PParser::TContext::T25() {
  return getToken(PParser::T25, 0);
}

tree::TerminalNode* PParser::TContext::T26() {
  return getToken(PParser::T26, 0);
}

tree::TerminalNode* PParser::TContext::T27() {
  return getToken(PParser::T27, 0);
}

tree::TerminalNode* PParser::TContext::T28() {
  return getToken(PParser::T28, 0);
}

tree::TerminalNode* PParser::TContext::T29() {
  return getToken(PParser::T29, 0);
}

tree::TerminalNode* PParser::TContext::T30() {
  return getToken(PParser::T30, 0);
}

tree::TerminalNode* PParser::TContext::T31() {
  return getToken(PParser::T31, 0);
}

tree::TerminalNode* PParser::TContext::T32() {
  return getToken(PParser::T32, 0);
}

tree::TerminalNode* PParser::TContext::T33() {
  return getToken(PParser::T33, 0);
}

tree::TerminalNode* PParser::TContext::T34() {
  return getToken(PParser::T34, 0);
}

tree::TerminalNode* PParser::TContext::T35() {
  return getToken(PParser::T35, 0);
}

tree::TerminalNode* PParser::TContext::T36() {
  return getToken(PParser::T36, 0);
}

tree::TerminalNode* PParser::TContext::T37() {
  return getToken(PParser::T37, 0);
}

tree::TerminalNode* PParser::TContext::T38() {
  return getToken(PParser::T38, 0);
}

tree::TerminalNode* PParser::TContext::T39() {
  return getToken(PParser::T39, 0);
}

tree::TerminalNode* PParser::TContext::T40() {
  return getToken(PParser::T40, 0);
}

tree::TerminalNode* PParser::TContext::T41() {
  return getToken(PParser::T41, 0);
}

tree::TerminalNode* PParser::TContext::T42() {
  return getToken(PParser::T42, 0);
}

tree::TerminalNode* PParser::TContext::T43() {
  return getToken(PParser::T43, 0);
}

tree::TerminalNode* PParser::TContext::T44() {
  return getToken(PParser::T44, 0);
}

tree::TerminalNode* PParser::TContext::T45() {
  return getToken(PParser::T45, 0);
}

tree::TerminalNode* PParser::TContext::T46() {
  return getToken(PParser::T46, 0);
}

tree::TerminalNode* PParser::TContext::T47() {
  return getToken(PParser::T47, 0);
}

tree::TerminalNode* PParser::TContext::T48() {
  return getToken(PParser::T48, 0);
}

tree::TerminalNode* PParser::TContext::T49() {
  return getToken(PParser::T49, 0);
}

tree::TerminalNode* PParser::TContext::T50() {
  return getToken(PParser::T50, 0);
}

tree::TerminalNode* PParser::TContext::T51() {
  return getToken(PParser::T51, 0);
}

tree::TerminalNode* PParser::TContext::T52() {
  return getToken(PParser::T52, 0);
}

tree::TerminalNode* PParser::TContext::T53() {
  return getToken(PParser::T53, 0);
}

tree::TerminalNode* PParser::TContext::T54() {
  return getToken(PParser::T54, 0);
}

tree::TerminalNode* PParser::TContext::T55() {
  return getToken(PParser::T55, 0);
}

tree::TerminalNode* PParser::TContext::T56() {
  return getToken(PParser::T56, 0);
}

tree::TerminalNode* PParser::TContext::T57() {
  return getToken(PParser::T57, 0);
}

tree::TerminalNode* PParser::TContext::T58() {
  return getToken(PParser::T58, 0);
}

tree::TerminalNode* PParser::TContext::T59() {
  return getToken(PParser::T59, 0);
}

tree::TerminalNode* PParser::TContext::T60() {
  return getToken(PParser::T60, 0);
}

tree::TerminalNode* PParser::TContext::T61() {
  return getToken(PParser::T61, 0);
}

tree::TerminalNode* PParser::TContext::T62() {
  return getToken(PParser::T62, 0);
}

tree::TerminalNode* PParser::TContext::T63() {
  return getToken(PParser::T63, 0);
}


size_t PParser::TContext::getRuleIndex() const {
  return PParser::RuleT;
}


PParser::TContext* PParser::t() {
  TContext *_localctx = _tracker.createInstance<TContext>(_ctx, getState());
  enterRule(_localctx, 2, PParser::RuleT);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(11);
    _la = _input->LA(1);
    if (!(((((_la - 1) & ~ 0x3fULL) == 0) &&
      ((1ULL << (_la - 1)) & -1) != 0))) {
    _errHandler->recoverInline(this);
    }
    else {
      _errHandler->reportMatch(this);
      consume();
    }
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

void PParser::initialize() {
#if ANTLR4_USE_THREAD_LOCAL_CACHE
  pParserInitialize();
#else
  ::antlr4::internal::call_once(pParserOnceFlag, pParserInitialize);
#endif
}
