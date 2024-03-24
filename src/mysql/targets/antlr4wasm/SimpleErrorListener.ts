/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
    ANTLRErrorListener as AEL, type ATNConfigSet, type ATNSimulator, type BitSet, type Parser,
    type RecognitionException, type Recognizer, type Token
} from "./antlr4-runtime";

import type { IParserErrorInfo } from "../misc/types";

const ANTLRErrorListener = AEL.extend<AEL>("AEL", {});
type ANTLRErrorListener = InstanceType<typeof ANTLRErrorListener>;

export class SimpleErrorListener extends ANTLRErrorListener {
    public constructor(private errors: IParserErrorInfo[]) {
        super();
    }

    public override syntaxError(recognizer: Recognizer<ATNSimulator>, offendingSymbol: Token | null, line: number,
        charPositionInLine: number, message: string, e: RecognitionException | null): void {

        if (length === 0) {
            length = 1;
        }

        this.errors.push({
            message,
            tokenType: offendingSymbol?.getType() ?? 0,
            charOffset: offendingSymbol?.getStartIndex() ?? 0,
            line,
            offset: charPositionInLine,
            length
        });
    };

    public override reportAmbiguity(recognizer: Parser, /*dfa: DFA,*/ startIndex: number, stopIndex: number, exact: boolean,
        ambigAlts: BitSet, configs: ATNConfigSet): void { }
    public override reportAttemptingFullContext(recognizer: Parser, /*dfa: DFA,*/ startIndex: number, stopIndex: number,
        conflictingAlts: BitSet, configs: ATNConfigSet): void { }
    public override reportContextSensitivity(recognizer: Parser, /*dfa: DFA,*/ startIndex: number, stopIndex: number,
        prediction: number, configs: ATNConfigSet): void { }

}
