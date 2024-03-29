// Generated from ./targets/P.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class PParser extends Parser {
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
	public static readonly RULE_r = 0;
	public static readonly RULE_t = 1;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"r", "t",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'T0'", "'T1'", "'T2'", "'T3'", "'T4'", "'T5'", "'T6'", "'T7'", 
		"'T8'", "'T9'", "'T10'", "'T11'", "'T12'", "'T13'", "'T14'", "'T15'", 
		"'T16'", "'T17'", "'T18'", "'T19'", "'T20'", "'T21'", "'T22'", "'T23'", 
		"'T24'", "'T25'", "'T26'", "'T27'", "'T28'", "'T29'", "'T30'", "'T31'", 
		"'T32'", "'T33'", "'T34'", "'T35'", "'T36'", "'T37'", "'T38'", "'T39'", 
		"'T40'", "'T41'", "'T42'", "'T43'", "'T44'", "'T45'", "'T46'", "'T47'", 
		"'T48'", "'T49'", "'T50'", "'T51'", "'T52'", "'T53'", "'T54'", "'T55'", 
		"'T56'", "'T57'", "'T58'", "'T59'", "'T60'", "'T61'", "'T62'", "'T63'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", 
		"T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "T19", 
		"T20", "T21", "T22", "T23", "T24", "T25", "T26", "T27", "T28", "T29", 
		"T30", "T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38", "T39", 
		"T40", "T41", "T42", "T43", "T44", "T45", "T46", "T47", "T48", "T49", 
		"T50", "T51", "T52", "T53", "T54", "T55", "T56", "T57", "T58", "T59", 
		"T60", "T61", "T62", "T63", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(PParser._LITERAL_NAMES, PParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return PParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "P.g4"; }

	// @Override
	public get ruleNames(): string[] { return PParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return PParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(PParser._ATN, this);
	}
	// @RuleVersion(0)
	public r(): RContext {
		let _localctx: RContext = new RContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, PParser.RULE_r);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
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
			} while (((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & ((1 << (PParser.T0 - 1)) | (1 << (PParser.T1 - 1)) | (1 << (PParser.T2 - 1)) | (1 << (PParser.T3 - 1)) | (1 << (PParser.T4 - 1)) | (1 << (PParser.T5 - 1)) | (1 << (PParser.T6 - 1)) | (1 << (PParser.T7 - 1)) | (1 << (PParser.T8 - 1)) | (1 << (PParser.T9 - 1)) | (1 << (PParser.T10 - 1)) | (1 << (PParser.T11 - 1)) | (1 << (PParser.T12 - 1)) | (1 << (PParser.T13 - 1)) | (1 << (PParser.T14 - 1)) | (1 << (PParser.T15 - 1)) | (1 << (PParser.T16 - 1)) | (1 << (PParser.T17 - 1)) | (1 << (PParser.T18 - 1)) | (1 << (PParser.T19 - 1)) | (1 << (PParser.T20 - 1)) | (1 << (PParser.T21 - 1)) | (1 << (PParser.T22 - 1)) | (1 << (PParser.T23 - 1)) | (1 << (PParser.T24 - 1)) | (1 << (PParser.T25 - 1)) | (1 << (PParser.T26 - 1)) | (1 << (PParser.T27 - 1)) | (1 << (PParser.T28 - 1)) | (1 << (PParser.T29 - 1)) | (1 << (PParser.T30 - 1)) | (1 << (PParser.T31 - 1)))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (PParser.T32 - 33)) | (1 << (PParser.T33 - 33)) | (1 << (PParser.T34 - 33)) | (1 << (PParser.T35 - 33)) | (1 << (PParser.T36 - 33)) | (1 << (PParser.T37 - 33)) | (1 << (PParser.T38 - 33)) | (1 << (PParser.T39 - 33)) | (1 << (PParser.T40 - 33)) | (1 << (PParser.T41 - 33)) | (1 << (PParser.T42 - 33)) | (1 << (PParser.T43 - 33)) | (1 << (PParser.T44 - 33)) | (1 << (PParser.T45 - 33)) | (1 << (PParser.T46 - 33)) | (1 << (PParser.T47 - 33)) | (1 << (PParser.T48 - 33)) | (1 << (PParser.T49 - 33)) | (1 << (PParser.T50 - 33)) | (1 << (PParser.T51 - 33)) | (1 << (PParser.T52 - 33)) | (1 << (PParser.T53 - 33)) | (1 << (PParser.T54 - 33)) | (1 << (PParser.T55 - 33)) | (1 << (PParser.T56 - 33)) | (1 << (PParser.T57 - 33)) | (1 << (PParser.T58 - 33)) | (1 << (PParser.T59 - 33)) | (1 << (PParser.T60 - 33)) | (1 << (PParser.T61 - 33)) | (1 << (PParser.T62 - 33)) | (1 << (PParser.T63 - 33)))) !== 0));
			this.state = 9;
			this.match(PParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public t(): TContext {
		let _localctx: TContext = new TContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, PParser.RULE_t);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 11;
			_la = this._input.LA(1);
			if (!(((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & ((1 << (PParser.T0 - 1)) | (1 << (PParser.T1 - 1)) | (1 << (PParser.T2 - 1)) | (1 << (PParser.T3 - 1)) | (1 << (PParser.T4 - 1)) | (1 << (PParser.T5 - 1)) | (1 << (PParser.T6 - 1)) | (1 << (PParser.T7 - 1)) | (1 << (PParser.T8 - 1)) | (1 << (PParser.T9 - 1)) | (1 << (PParser.T10 - 1)) | (1 << (PParser.T11 - 1)) | (1 << (PParser.T12 - 1)) | (1 << (PParser.T13 - 1)) | (1 << (PParser.T14 - 1)) | (1 << (PParser.T15 - 1)) | (1 << (PParser.T16 - 1)) | (1 << (PParser.T17 - 1)) | (1 << (PParser.T18 - 1)) | (1 << (PParser.T19 - 1)) | (1 << (PParser.T20 - 1)) | (1 << (PParser.T21 - 1)) | (1 << (PParser.T22 - 1)) | (1 << (PParser.T23 - 1)) | (1 << (PParser.T24 - 1)) | (1 << (PParser.T25 - 1)) | (1 << (PParser.T26 - 1)) | (1 << (PParser.T27 - 1)) | (1 << (PParser.T28 - 1)) | (1 << (PParser.T29 - 1)) | (1 << (PParser.T30 - 1)) | (1 << (PParser.T31 - 1)))) !== 0) || ((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & ((1 << (PParser.T32 - 33)) | (1 << (PParser.T33 - 33)) | (1 << (PParser.T34 - 33)) | (1 << (PParser.T35 - 33)) | (1 << (PParser.T36 - 33)) | (1 << (PParser.T37 - 33)) | (1 << (PParser.T38 - 33)) | (1 << (PParser.T39 - 33)) | (1 << (PParser.T40 - 33)) | (1 << (PParser.T41 - 33)) | (1 << (PParser.T42 - 33)) | (1 << (PParser.T43 - 33)) | (1 << (PParser.T44 - 33)) | (1 << (PParser.T45 - 33)) | (1 << (PParser.T46 - 33)) | (1 << (PParser.T47 - 33)) | (1 << (PParser.T48 - 33)) | (1 << (PParser.T49 - 33)) | (1 << (PParser.T50 - 33)) | (1 << (PParser.T51 - 33)) | (1 << (PParser.T52 - 33)) | (1 << (PParser.T53 - 33)) | (1 << (PParser.T54 - 33)) | (1 << (PParser.T55 - 33)) | (1 << (PParser.T56 - 33)) | (1 << (PParser.T57 - 33)) | (1 << (PParser.T58 - 33)) | (1 << (PParser.T59 - 33)) | (1 << (PParser.T60 - 33)) | (1 << (PParser.T61 - 33)) | (1 << (PParser.T62 - 33)) | (1 << (PParser.T63 - 33)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03C\x10\x04\x02" +
		"\t\x02\x04\x03\t\x03\x03\x02\x06\x02\b\n\x02\r\x02\x0E\x02\t\x03\x02\x03" +
		"\x02\x03\x03\x03\x03\x03\x03\x02\x02\x02\x04\x02\x02\x04\x02\x02\x03\x03" +
		"\x02\x03B\x02\x0E\x02\x07\x03\x02\x02\x02\x04\r\x03\x02\x02\x02\x06\b" +
		"\x05\x04\x03\x02\x07\x06\x03\x02\x02\x02\b\t\x03\x02\x02\x02\t\x07\x03" +
		"\x02\x02\x02\t\n\x03\x02\x02\x02\n\v\x03\x02\x02\x02\v\f\x07\x02\x02\x03" +
		"\f\x03\x03\x02\x02\x02\r\x0E\t\x02\x02\x02\x0E\x05\x03\x02\x02\x02\x03" +
		"\t";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PParser.__ATN) {
			PParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(PParser._serializedATN));
		}

		return PParser.__ATN;
	}

}

export class RContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(PParser.EOF, 0); }
	public t(): TContext[];
	public t(i: number): TContext;
	public t(i?: number): TContext | TContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TContext);
		} else {
			return this.getRuleContext(i, TContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PParser.RULE_r; }
}


export class TContext extends ParserRuleContext {
	public T0(): TerminalNode | undefined { return this.tryGetToken(PParser.T0, 0); }
	public T1(): TerminalNode | undefined { return this.tryGetToken(PParser.T1, 0); }
	public T2(): TerminalNode | undefined { return this.tryGetToken(PParser.T2, 0); }
	public T3(): TerminalNode | undefined { return this.tryGetToken(PParser.T3, 0); }
	public T4(): TerminalNode | undefined { return this.tryGetToken(PParser.T4, 0); }
	public T5(): TerminalNode | undefined { return this.tryGetToken(PParser.T5, 0); }
	public T6(): TerminalNode | undefined { return this.tryGetToken(PParser.T6, 0); }
	public T7(): TerminalNode | undefined { return this.tryGetToken(PParser.T7, 0); }
	public T8(): TerminalNode | undefined { return this.tryGetToken(PParser.T8, 0); }
	public T9(): TerminalNode | undefined { return this.tryGetToken(PParser.T9, 0); }
	public T10(): TerminalNode | undefined { return this.tryGetToken(PParser.T10, 0); }
	public T11(): TerminalNode | undefined { return this.tryGetToken(PParser.T11, 0); }
	public T12(): TerminalNode | undefined { return this.tryGetToken(PParser.T12, 0); }
	public T13(): TerminalNode | undefined { return this.tryGetToken(PParser.T13, 0); }
	public T14(): TerminalNode | undefined { return this.tryGetToken(PParser.T14, 0); }
	public T15(): TerminalNode | undefined { return this.tryGetToken(PParser.T15, 0); }
	public T16(): TerminalNode | undefined { return this.tryGetToken(PParser.T16, 0); }
	public T17(): TerminalNode | undefined { return this.tryGetToken(PParser.T17, 0); }
	public T18(): TerminalNode | undefined { return this.tryGetToken(PParser.T18, 0); }
	public T19(): TerminalNode | undefined { return this.tryGetToken(PParser.T19, 0); }
	public T20(): TerminalNode | undefined { return this.tryGetToken(PParser.T20, 0); }
	public T21(): TerminalNode | undefined { return this.tryGetToken(PParser.T21, 0); }
	public T22(): TerminalNode | undefined { return this.tryGetToken(PParser.T22, 0); }
	public T23(): TerminalNode | undefined { return this.tryGetToken(PParser.T23, 0); }
	public T24(): TerminalNode | undefined { return this.tryGetToken(PParser.T24, 0); }
	public T25(): TerminalNode | undefined { return this.tryGetToken(PParser.T25, 0); }
	public T26(): TerminalNode | undefined { return this.tryGetToken(PParser.T26, 0); }
	public T27(): TerminalNode | undefined { return this.tryGetToken(PParser.T27, 0); }
	public T28(): TerminalNode | undefined { return this.tryGetToken(PParser.T28, 0); }
	public T29(): TerminalNode | undefined { return this.tryGetToken(PParser.T29, 0); }
	public T30(): TerminalNode | undefined { return this.tryGetToken(PParser.T30, 0); }
	public T31(): TerminalNode | undefined { return this.tryGetToken(PParser.T31, 0); }
	public T32(): TerminalNode | undefined { return this.tryGetToken(PParser.T32, 0); }
	public T33(): TerminalNode | undefined { return this.tryGetToken(PParser.T33, 0); }
	public T34(): TerminalNode | undefined { return this.tryGetToken(PParser.T34, 0); }
	public T35(): TerminalNode | undefined { return this.tryGetToken(PParser.T35, 0); }
	public T36(): TerminalNode | undefined { return this.tryGetToken(PParser.T36, 0); }
	public T37(): TerminalNode | undefined { return this.tryGetToken(PParser.T37, 0); }
	public T38(): TerminalNode | undefined { return this.tryGetToken(PParser.T38, 0); }
	public T39(): TerminalNode | undefined { return this.tryGetToken(PParser.T39, 0); }
	public T40(): TerminalNode | undefined { return this.tryGetToken(PParser.T40, 0); }
	public T41(): TerminalNode | undefined { return this.tryGetToken(PParser.T41, 0); }
	public T42(): TerminalNode | undefined { return this.tryGetToken(PParser.T42, 0); }
	public T43(): TerminalNode | undefined { return this.tryGetToken(PParser.T43, 0); }
	public T44(): TerminalNode | undefined { return this.tryGetToken(PParser.T44, 0); }
	public T45(): TerminalNode | undefined { return this.tryGetToken(PParser.T45, 0); }
	public T46(): TerminalNode | undefined { return this.tryGetToken(PParser.T46, 0); }
	public T47(): TerminalNode | undefined { return this.tryGetToken(PParser.T47, 0); }
	public T48(): TerminalNode | undefined { return this.tryGetToken(PParser.T48, 0); }
	public T49(): TerminalNode | undefined { return this.tryGetToken(PParser.T49, 0); }
	public T50(): TerminalNode | undefined { return this.tryGetToken(PParser.T50, 0); }
	public T51(): TerminalNode | undefined { return this.tryGetToken(PParser.T51, 0); }
	public T52(): TerminalNode | undefined { return this.tryGetToken(PParser.T52, 0); }
	public T53(): TerminalNode | undefined { return this.tryGetToken(PParser.T53, 0); }
	public T54(): TerminalNode | undefined { return this.tryGetToken(PParser.T54, 0); }
	public T55(): TerminalNode | undefined { return this.tryGetToken(PParser.T55, 0); }
	public T56(): TerminalNode | undefined { return this.tryGetToken(PParser.T56, 0); }
	public T57(): TerminalNode | undefined { return this.tryGetToken(PParser.T57, 0); }
	public T58(): TerminalNode | undefined { return this.tryGetToken(PParser.T58, 0); }
	public T59(): TerminalNode | undefined { return this.tryGetToken(PParser.T59, 0); }
	public T60(): TerminalNode | undefined { return this.tryGetToken(PParser.T60, 0); }
	public T61(): TerminalNode | undefined { return this.tryGetToken(PParser.T61, 0); }
	public T62(): TerminalNode | undefined { return this.tryGetToken(PParser.T62, 0); }
	public T63(): TerminalNode | undefined { return this.tryGetToken(PParser.T63, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PParser.RULE_t; }
}


