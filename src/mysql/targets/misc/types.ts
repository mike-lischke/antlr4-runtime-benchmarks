/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/** Some code was taken from the MySQL Shell for VS Code extension. */

export interface TextSpan {
    start: number;
    length: number;
}

/** Indicates how a statement ends. */
export enum StatementFinishState {
    /** Ends with a delimiter. */
    Complete,

    /** Ends with an open comment (multiline or single line w/o following new line). */
    OpenComment,

    /** A string (single, double or backtick quoted) wasn't closed. */
    OpenString,

    /** The delimiter is missing. */
    NoDelimiter,

    /** The statement changes the delimiter. */
    DelimiterChange,
}

export interface IStatementSpan {
    /**
     * The delimiter with which this statement ended or undefined if no delimiter was found.
     */
    delimiter?: string;

    /** Start and length of the entire statement, including leading whitespaces. */
    span: TextSpan;

    contentStart: number;

    /** The offset where non-whitespace content starts. */
    state: StatementFinishState;
}

export interface IParserErrorInfo {
    message: string;
    tokenType: number;

    /** Offset from the beginning of the input to the error position. */
    charOffset: number;

    /** Error line. */
    line: number;

    /** Char offset in the error line to the error start position. */
    offset: number;
    length: number;
}

export interface IParseService {
    /**
     * Initializes the lexer with a new string and lets the tokenizer load all tokens.
     *
     * @param text The text to tokenize.
     * @param serverVersion The version of the MySQL server to use for parsing.
     * @param sqlMode The current SQL mode in the server.
     */
    tokenize(text: string, serverVersion: number, sqlMode: string): void;

    /**
     * Quick check for syntax errors.
     *
     * @returns True if no error was found, otherwise false.
     */
    errorCheck(): boolean;

    /**
     * Returns a collection of errors from the last parser run. The start position is offset by the given
     * value (used to adjust error position in a larger context).
     *
     * @param offset The character offset to add for each error.
     *
     * @returns The updated error list from the last parse run.
     */
    errorsWithOffset(offset: number): IParserErrorInfo[];

    /**
     * Removes all cached DFA states, resetting so the simulators to their initial state.
     */
    clearDFA(): void;
}
