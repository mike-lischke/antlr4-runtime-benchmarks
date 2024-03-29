/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

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
    tokenize(text: string): void;

    /**
     * Quick check for syntax errors.
     *
     * @returns True if no error was found, otherwise false.
     */
    errorCheck(): boolean;

    /**
     * Removes all cached DFA states, resetting so the simulators to their initial state.
     */
    clearDFA(): void;
}
