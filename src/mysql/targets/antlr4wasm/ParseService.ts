/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
    ANTLRInputStream, BailErrorStrategy, CommonTokenStream, PredictionMode, flushPendingDeletes,
} from "./antlr4-runtime.js";

import { IParserErrorInfo, type IParseService } from "../misc/types.js";
import MySQLLexer from "./MySQLLexer.js";
import MySQLParser from "./MySQLParser.js";
import { SimpleErrorListener } from "./SimpleErrorListener.js";

export class ParseService implements IParseService {
    private stream = new ANTLRInputStream();
    private lexer = new MySQLLexer(this.stream);
    private tokenStream = new CommonTokenStream(this.lexer);
    private parser = new MySQLParser(this.tokenStream);

    private errors: IParserErrorInfo[] = [];

    public constructor(charSets: Set<string>) {
        const errorListener = new SimpleErrorListener(this.errors);

        this.lexer.charSets = charSets;
        this.lexer.removeErrorListeners();
        this.lexer.addErrorListener(errorListener);

        this.parser.removeParseListeners();
        this.parser.removeErrorListeners();
        this.parser.addErrorListener(errorListener);
        this.parser.setErrorHandler(new BailErrorStrategy());
        this.parser.getInterpreter().setPredictionMode(PredictionMode.SLL);
        this.parser.setBuildParseTree(false);
    }

    public cleanup(): void {
        this.parser.delete();
        this.tokenStream.delete();
        this.lexer.delete();
        this.stream.delete();
    }

    public tokenize(text: string, serverVersion: number, sqlMode: string): void {
        this.stream.load(text);
        this.lexer.setInputStream(this.stream);
        this.tokenStream.setTokenSource(this.lexer);
        this.lexer.serverVersion = serverVersion;
        this.lexer.sqlModeFromString(sqlMode);

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
        // Clearing the DFA caches crashes. The WASM target is all but ready.
        //this.lexer.getInterpreter().clearDFA();
        //this.parser.getInterpreter().clearDFA();
    }

    private startParsing(): void {
        this.errors = [];
        this.parser.reset();

        this.parser.serverVersion = this.lexer.serverVersion;
        this.parser.sqlModes = this.lexer.sqlModes;

        const tree = this.parser.query();
        tree?.delete();

        flushPendingDeletes();
    }
}
