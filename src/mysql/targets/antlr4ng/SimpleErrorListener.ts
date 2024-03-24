/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { BaseErrorListener, type ATNSimulator, type Recognizer, type Token } from "antlr4ng";
import type { IParserErrorInfo } from "../misc/types";

export class SimpleErrorListener extends BaseErrorListener {
    public constructor(private errors: IParserErrorInfo[]) {
        super();
    }

    public override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>,
        offendingSymbol: S | null, line: number, column: number, message: string): void {

        this.errors.push({
            message,
            tokenType: offendingSymbol?.type ?? 0,
            charOffset: offendingSymbol?.start ?? 0,
            line,
            offset: column,
            length: (offendingSymbol?.stop ?? 0) - (offendingSymbol?.start ?? 0) + 1,
        });
    }
}
