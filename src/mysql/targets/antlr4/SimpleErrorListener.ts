/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ErrorListener, type Recognizer, type Token } from "antlr4";
import type { IParserErrorInfo } from "../misc/types";
import type { ATNSimulator } from "antlr4/src/antlr4/atn/ATNSimulator";

export class SimpleErrorListener extends ErrorListener<number> {
    public constructor(private errors: IParserErrorInfo[]) {
        super();
    }

    public override syntaxError<S extends Token | number, T extends ATNSimulator>(recognizer: Recognizer<T>,
        offendingSymbol: S | null, line: number, column: number, message: string): void {

        const token = offendingSymbol as Token;
        this.errors.push({
            message,
            tokenType: token?.type ?? 0,
            charOffset: token?.start ?? 0,
            line,
            offset: column,
            length: (token?.stop ?? 0) - (token?.start ?? 0) + 1,
        });
    }
}
