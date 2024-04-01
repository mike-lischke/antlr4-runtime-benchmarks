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

// A list of character sets supported by MySQL. These are used for the lexer to handle string repertoires.
const charSets = new Set<string>([
    "_big5", "_dec8", "_cp850", "_hp8", "_koi8r", "_latin1", "_latin2", "_swe7", "_ascii", "_ujis",
    "_sjis", "_hebrew", "_tis620", "_euckr", "_koi8u", "_gb18030", "_gb2312", "_greek", "_cp1250", "_gbk",
    "_latin5", "_armscii8", "_utf8", "_ucs2", "_cp866", "_keybcs2", "_macce", "_macroman", "_cp852", "_latin7",
    "_cp1251", "_cp1256", "_cp1257", "_binary", "_geostd8", "_cp932", "_eucjpms", "_utf8mb4", "_utf16", "_utf32",
]);

export class ParseService implements IParseService {
    private stream = new ANTLRInputStream();
    private lexer = new MySQLLexer(this.stream);
    private tokenStream = new CommonTokenStream(this.lexer);
    private parser = new MySQLParser(this.tokenStream);

    private errors: IParserErrorInfo[] = [];

    public constructor() {
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
