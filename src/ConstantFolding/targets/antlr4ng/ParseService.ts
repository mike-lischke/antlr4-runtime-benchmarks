/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
    BailErrorStrategy, CharStream, CommonTokenStream, PredictionMode,
} from "antlr4ng";

import { type IParseService, type IParserErrorInfo } from "../misc/types.js";
import { PLexer } from "./PLexer.js";
import { PParser } from "./PParser.js";

import { SimpleErrorListener } from "./SimpleErrorListener.js";

export class ParseService implements IParseService {
    private lexer = new PLexer(CharStream.fromString(""));
    private tokenStream = new CommonTokenStream(this.lexer);
    private parser = new PParser(this.tokenStream);

    private errors: IParserErrorInfo[] = [];

    public constructor() {
        const errorListener = new SimpleErrorListener(this.errors);

        this.lexer.removeErrorListeners();
        this.lexer.addErrorListener(errorListener);

        this.parser.removeParseListeners();
        this.parser.removeErrorListeners();
        this.parser.addErrorListener(errorListener);
        this.parser.errorHandler = new BailErrorStrategy();
        this.parser.interpreter.predictionMode = PredictionMode.SLL;
        this.parser.buildParseTrees = false;
    }

    public tokenize(text: string): void {
        this.lexer.inputStream = CharStream.fromString(text);
        this.tokenStream.setTokenSource(this.lexer);

        this.tokenStream.fill();
    }

    public errorCheck(): boolean {
        this.startParsing();

        return this.errors.length === 0;
    }

    public errorsWithOffset(offset: number): IParserErrorInfo[] {
        const result: IParserErrorInfo[] = [...this.errors];
        result.forEach((error: IParserErrorInfo) => {
            error.charOffset += offset;
        });

        return result;
    }

    public clearDFA(): void {
        this.lexer.interpreter.clearDFA();
        this.parser.interpreter.clearDFA();
    }

    /**
     * This is the method to parse text. It uses the token stream from the last call to tokenize.
     */
    private startParsing(): void {
        this.errors = [];

        this.parser.reset();

        this.parser.r();
    }
}
