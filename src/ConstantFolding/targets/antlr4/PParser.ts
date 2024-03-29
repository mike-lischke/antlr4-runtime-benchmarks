// Generated from ./targets/P.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class PParser extends Parser {
	public static readonly T0 = 1;
	public static readonly T1 = 2;
	public static readonly T2 = 3;
	public static readonly T3 = 4;
	public static readonly T4 = 5;
	public static readonly T5 = 6;
	public static readonly T6 = 7;
	public static readonly T7 = 8;
	public static readonly T8 = 9;
	public static readonly T9 = 10;
	public static readonly T10 = 11;
	public static readonly T11 = 12;
	public static readonly T12 = 13;
	public static readonly T13 = 14;
	public static readonly T14 = 15;
	public static readonly T15 = 16;
	public static readonly T16 = 17;
	public static readonly T17 = 18;
	public static readonly T18 = 19;
	public static readonly T19 = 20;
	public static readonly T20 = 21;
	public static readonly T21 = 22;
	public static readonly T22 = 23;
	public static readonly T23 = 24;
	public static readonly T24 = 25;
	public static readonly T25 = 26;
	public static readonly T26 = 27;
	public static readonly T27 = 28;
	public static readonly T28 = 29;
	public static readonly T29 = 30;
	public static readonly T30 = 31;
	public static readonly T31 = 32;
	public static readonly T32 = 33;
	public static readonly T33 = 34;
	public static readonly T34 = 35;
	public static readonly T35 = 36;
	public static readonly T36 = 37;
	public static readonly T37 = 38;
	public static readonly T38 = 39;
	public static readonly T39 = 40;
	public static readonly T40 = 41;
	public static readonly T41 = 42;
	public static readonly T42 = 43;
	public static readonly T43 = 44;
	public static readonly T44 = 45;
	public static readonly T45 = 46;
	public static readonly T46 = 47;
	public static readonly T47 = 48;
	public static readonly T48 = 49;
	public static readonly T49 = 50;
	public static readonly T50 = 51;
	public static readonly T51 = 52;
	public static readonly T52 = 53;
	public static readonly T53 = 54;
	public static readonly T54 = 55;
	public static readonly T55 = 56;
	public static readonly T56 = 57;
	public static readonly T57 = 58;
	public static readonly T58 = 59;
	public static readonly T59 = 60;
	public static readonly T60 = 61;
	public static readonly T61 = 62;
	public static readonly T62 = 63;
	public static readonly T63 = 64;
	public static readonly WS = 65;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_r = 0;
	public static readonly RULE_t = 1;
	public static readonly literalNames: (string | null)[] = [ null, "'T0'", 
                                                            "'T1'", "'T2'", 
                                                            "'T3'", "'T4'", 
                                                            "'T5'", "'T6'", 
                                                            "'T7'", "'T8'", 
                                                            "'T9'", "'T10'", 
                                                            "'T11'", "'T12'", 
                                                            "'T13'", "'T14'", 
                                                            "'T15'", "'T16'", 
                                                            "'T17'", "'T18'", 
                                                            "'T19'", "'T20'", 
                                                            "'T21'", "'T22'", 
                                                            "'T23'", "'T24'", 
                                                            "'T25'", "'T26'", 
                                                            "'T27'", "'T28'", 
                                                            "'T29'", "'T30'", 
                                                            "'T31'", "'T32'", 
                                                            "'T33'", "'T34'", 
                                                            "'T35'", "'T36'", 
                                                            "'T37'", "'T38'", 
                                                            "'T39'", "'T40'", 
                                                            "'T41'", "'T42'", 
                                                            "'T43'", "'T44'", 
                                                            "'T45'", "'T46'", 
                                                            "'T47'", "'T48'", 
                                                            "'T49'", "'T50'", 
                                                            "'T51'", "'T52'", 
                                                            "'T53'", "'T54'", 
                                                            "'T55'", "'T56'", 
                                                            "'T57'", "'T58'", 
                                                            "'T59'", "'T60'", 
                                                            "'T61'", "'T62'", 
                                                            "'T63'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "T0", 
                                                             "T1", "T2", 
                                                             "T3", "T4", 
                                                             "T5", "T6", 
                                                             "T7", "T8", 
                                                             "T9", "T10", 
                                                             "T11", "T12", 
                                                             "T13", "T14", 
                                                             "T15", "T16", 
                                                             "T17", "T18", 
                                                             "T19", "T20", 
                                                             "T21", "T22", 
                                                             "T23", "T24", 
                                                             "T25", "T26", 
                                                             "T27", "T28", 
                                                             "T29", "T30", 
                                                             "T31", "T32", 
                                                             "T33", "T34", 
                                                             "T35", "T36", 
                                                             "T37", "T38", 
                                                             "T39", "T40", 
                                                             "T41", "T42", 
                                                             "T43", "T44", 
                                                             "T45", "T46", 
                                                             "T47", "T48", 
                                                             "T49", "T50", 
                                                             "T51", "T52", 
                                                             "T53", "T54", 
                                                             "T55", "T56", 
                                                             "T57", "T58", 
                                                             "T59", "T60", 
                                                             "T61", "T62", 
                                                             "T63", "WS" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"r", "t",
	];
	public get grammarFileName(): string { return "P.g4"; }
	public get literalNames(): (string | null)[] { return PParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return PParser.symbolicNames; }
	public get ruleNames(): string[] { return PParser.ruleNames; }
	public get serializedATN(): number[] { return PParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, PParser._ATN, PParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public r(): RContext {
		let localctx: RContext = new RContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, PParser.RULE_r);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 5;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 4;
				this.t();
				}
				}
				this.state = 7;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & 4294967295) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294967295) !== 0));
			this.state = 9;
			this.match(PParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public t(): TContext {
		let localctx: TContext = new TContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, PParser.RULE_t);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 11;
			_la = this._input.LA(1);
			if(!(((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & 4294967295) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 4294967295) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,65,14,2,0,7,0,2,
	1,7,1,1,0,4,0,6,8,0,11,0,12,0,7,1,0,1,0,1,1,1,1,1,1,0,0,2,0,2,0,1,1,0,1,
	64,12,0,5,1,0,0,0,2,11,1,0,0,0,4,6,3,2,1,0,5,4,1,0,0,0,6,7,1,0,0,0,7,5,
	1,0,0,0,7,8,1,0,0,0,8,9,1,0,0,0,9,10,5,0,0,1,10,1,1,0,0,0,11,12,7,0,0,0,
	12,3,1,0,0,0,1,7];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PParser.__ATN) {
			PParser.__ATN = new ATNDeserializer().deserialize(PParser._serializedATN);
		}

		return PParser.__ATN;
	}


	static DecisionsToDFA = PParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class RContext extends ParserRuleContext {
	constructor(parser?: PParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(PParser.EOF, 0);
	}
	public t_list(): TContext[] {
		return this.getTypedRuleContexts(TContext) as TContext[];
	}
	public t(i: number): TContext {
		return this.getTypedRuleContext(TContext, i) as TContext;
	}
    public get ruleIndex(): number {
    	return PParser.RULE_r;
	}
}


export class TContext extends ParserRuleContext {
	constructor(parser?: PParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public T0(): TerminalNode {
		return this.getToken(PParser.T0, 0);
	}
	public T1(): TerminalNode {
		return this.getToken(PParser.T1, 0);
	}
	public T2(): TerminalNode {
		return this.getToken(PParser.T2, 0);
	}
	public T3(): TerminalNode {
		return this.getToken(PParser.T3, 0);
	}
	public T4(): TerminalNode {
		return this.getToken(PParser.T4, 0);
	}
	public T5(): TerminalNode {
		return this.getToken(PParser.T5, 0);
	}
	public T6(): TerminalNode {
		return this.getToken(PParser.T6, 0);
	}
	public T7(): TerminalNode {
		return this.getToken(PParser.T7, 0);
	}
	public T8(): TerminalNode {
		return this.getToken(PParser.T8, 0);
	}
	public T9(): TerminalNode {
		return this.getToken(PParser.T9, 0);
	}
	public T10(): TerminalNode {
		return this.getToken(PParser.T10, 0);
	}
	public T11(): TerminalNode {
		return this.getToken(PParser.T11, 0);
	}
	public T12(): TerminalNode {
		return this.getToken(PParser.T12, 0);
	}
	public T13(): TerminalNode {
		return this.getToken(PParser.T13, 0);
	}
	public T14(): TerminalNode {
		return this.getToken(PParser.T14, 0);
	}
	public T15(): TerminalNode {
		return this.getToken(PParser.T15, 0);
	}
	public T16(): TerminalNode {
		return this.getToken(PParser.T16, 0);
	}
	public T17(): TerminalNode {
		return this.getToken(PParser.T17, 0);
	}
	public T18(): TerminalNode {
		return this.getToken(PParser.T18, 0);
	}
	public T19(): TerminalNode {
		return this.getToken(PParser.T19, 0);
	}
	public T20(): TerminalNode {
		return this.getToken(PParser.T20, 0);
	}
	public T21(): TerminalNode {
		return this.getToken(PParser.T21, 0);
	}
	public T22(): TerminalNode {
		return this.getToken(PParser.T22, 0);
	}
	public T23(): TerminalNode {
		return this.getToken(PParser.T23, 0);
	}
	public T24(): TerminalNode {
		return this.getToken(PParser.T24, 0);
	}
	public T25(): TerminalNode {
		return this.getToken(PParser.T25, 0);
	}
	public T26(): TerminalNode {
		return this.getToken(PParser.T26, 0);
	}
	public T27(): TerminalNode {
		return this.getToken(PParser.T27, 0);
	}
	public T28(): TerminalNode {
		return this.getToken(PParser.T28, 0);
	}
	public T29(): TerminalNode {
		return this.getToken(PParser.T29, 0);
	}
	public T30(): TerminalNode {
		return this.getToken(PParser.T30, 0);
	}
	public T31(): TerminalNode {
		return this.getToken(PParser.T31, 0);
	}
	public T32(): TerminalNode {
		return this.getToken(PParser.T32, 0);
	}
	public T33(): TerminalNode {
		return this.getToken(PParser.T33, 0);
	}
	public T34(): TerminalNode {
		return this.getToken(PParser.T34, 0);
	}
	public T35(): TerminalNode {
		return this.getToken(PParser.T35, 0);
	}
	public T36(): TerminalNode {
		return this.getToken(PParser.T36, 0);
	}
	public T37(): TerminalNode {
		return this.getToken(PParser.T37, 0);
	}
	public T38(): TerminalNode {
		return this.getToken(PParser.T38, 0);
	}
	public T39(): TerminalNode {
		return this.getToken(PParser.T39, 0);
	}
	public T40(): TerminalNode {
		return this.getToken(PParser.T40, 0);
	}
	public T41(): TerminalNode {
		return this.getToken(PParser.T41, 0);
	}
	public T42(): TerminalNode {
		return this.getToken(PParser.T42, 0);
	}
	public T43(): TerminalNode {
		return this.getToken(PParser.T43, 0);
	}
	public T44(): TerminalNode {
		return this.getToken(PParser.T44, 0);
	}
	public T45(): TerminalNode {
		return this.getToken(PParser.T45, 0);
	}
	public T46(): TerminalNode {
		return this.getToken(PParser.T46, 0);
	}
	public T47(): TerminalNode {
		return this.getToken(PParser.T47, 0);
	}
	public T48(): TerminalNode {
		return this.getToken(PParser.T48, 0);
	}
	public T49(): TerminalNode {
		return this.getToken(PParser.T49, 0);
	}
	public T50(): TerminalNode {
		return this.getToken(PParser.T50, 0);
	}
	public T51(): TerminalNode {
		return this.getToken(PParser.T51, 0);
	}
	public T52(): TerminalNode {
		return this.getToken(PParser.T52, 0);
	}
	public T53(): TerminalNode {
		return this.getToken(PParser.T53, 0);
	}
	public T54(): TerminalNode {
		return this.getToken(PParser.T54, 0);
	}
	public T55(): TerminalNode {
		return this.getToken(PParser.T55, 0);
	}
	public T56(): TerminalNode {
		return this.getToken(PParser.T56, 0);
	}
	public T57(): TerminalNode {
		return this.getToken(PParser.T57, 0);
	}
	public T58(): TerminalNode {
		return this.getToken(PParser.T58, 0);
	}
	public T59(): TerminalNode {
		return this.getToken(PParser.T59, 0);
	}
	public T60(): TerminalNode {
		return this.getToken(PParser.T60, 0);
	}
	public T61(): TerminalNode {
		return this.getToken(PParser.T61, 0);
	}
	public T62(): TerminalNode {
		return this.getToken(PParser.T62, 0);
	}
	public T63(): TerminalNode {
		return this.getToken(PParser.T63, 0);
	}
    public get ruleIndex(): number {
    	return PParser.RULE_t;
	}
}
