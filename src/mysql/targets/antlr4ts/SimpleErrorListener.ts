/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { type Recognizer, type Token, ANTLRErrorListener } from "antlr4ts";
import type { ATNSimulator } from "antlr4ts/atn/ATNSimulator";

import type { IParserErrorInfo } from "../misc/types";

export class SimpleErrorListener implements ANTLRErrorListener<number> {
    public constructor(private errors: IParserErrorInfo[]) {
    }

    public syntaxError<S extends number | Token, T extends ATNSimulator>(recognizer: Recognizer<S, T>,
        offendingSymbol: S | undefined, line: number, column: number, message: string): void {

        // We need to cast offendingSymbol to Token here, as the type for the error listener is wrongly defined.
        const token = offendingSymbol as Token;
        this.errors.push({
            message,
            tokenType: token?.type ?? 0,
            charOffset: token?.startIndex ?? 0,
            line,
            offset: column,
            length: token ? token.stopIndex - token.startIndex + 1 : 0,
        });
    }
}
