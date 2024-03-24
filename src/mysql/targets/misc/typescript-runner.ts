/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Shared code for all TypeScript runtimes.
 */

import * as fs from "fs";
import * as path from "path";
import { performance } from "perf_hooks";
import { fileURLToPath } from "url";

import { StatementFinishState, type IParseService, type IParserErrorInfo, type IStatementSpan } from "./types";

const delimiterKeyword = /delimiter /i;
const runnerPath = path.dirname(fileURLToPath(import.meta.url));

interface ITestFile {
    name: string;
    initialDelimiter: string;
}

/** Information about a statement with version information. */
interface IVersionCheckResult {
    /** True if the version in the statement matched a given version. */
    matched: boolean;

    /** The statement with stripped version information. */
    statement: string;

    /** The found version. Can be 0 if the statement contains no version. */
    version: number;
}

const versionPattern = /^\[(<|<=|>|>=|=)(\d{5})\]/;
const relationMap = new Map<string, number>([
    ["<", 0], ["<=", 1], ["=", 2], [">=", 3], [">", 4],
]);

/**
 * Takes a block of SQL text and splits it into individual statements, by determining start position,
 * length and current delimiter for each. It is assumed the line break is a simple \n.
 * Note: the length includes anything up to (and including) the delimiter position.
 *
 * @param sql The SQL to split.
 * @param delimiter The initial delimiter to use.
 *
 * @returns A list of statement ranges.
 */
export const determineStatementRanges = (sql: string, delimiter: string): IStatementSpan[] => {
    const result: IStatementSpan[] = [];

    let start = 0;
    let head = start;
    let tail = head;
    const end = head + sql.length;

    let haveContent = false; // Set when anything else but comments were found for the current statement.

    /**
     * Checks the current tail position if that touches a delimiter. If that's the case then the current statement
     * is finished and a new one starts.
     *
     * @returns True if a delimiter was found, otherwise false.
     */
    const checkDelimiter = (): boolean => {
        if (sql[tail] === delimiter[0]) {
            // Found possible start of the delimiter. Check if it really is.
            if (delimiter.length === 1) {
                // Most common case.
                ++tail;
                result.push({
                    delimiter,
                    span: { start, length: tail - start },
                    contentStart: haveContent ? head : start,
                    state: StatementFinishState.Complete,
                });

                head = tail;
                start = head;
                haveContent = false;

                return true;
            } else {
                // Multi character delimiter?
                const candidate = sql.substring(tail, tail + delimiter.length);
                if (candidate === delimiter) {
                    // Multi char delimiter is complete. Tail still points to the start of the delimiter.
                    tail += delimiter.length;
                    result.push({
                        delimiter,
                        span: { start, length: tail - start },
                        contentStart: haveContent ? head : start,
                        state: StatementFinishState.Complete,
                    });

                    head = tail;
                    start = head;
                    haveContent = false;

                    return true;
                }
            }
        }

        return false;
    };

    while (tail < end) {
        if (!checkDelimiter()) {
            switch (sql[tail]) {
                case "/": { // Possible multi line comment or hidden (conditional) command.
                    if (sql[tail + 1] === "*") {
                        if (sql[tail + 2] === "!") { // Hidden command.
                            if (!haveContent) {
                                haveContent = true;
                                head = tail;
                            }
                            ++tail;
                        }
                        tail += 2;

                        while (true) {
                            while (tail < end && sql[tail] !== "*") {
                                ++tail;
                            }

                            if (tail === end) { // Unfinished multiline comment.
                                result.push({
                                    delimiter,
                                    span: { start, length: tail - start },
                                    contentStart: haveContent ? head : start,
                                    state: StatementFinishState.OpenComment,
                                });
                                start = tail;
                                head = tail;

                                break;
                            } else {
                                if (sql[++tail] === "/") {
                                    ++tail; // Skip the slash too.
                                    break;
                                }
                            }
                        }

                        if (!haveContent) {
                            head = tail; // Skip over the comment.
                        }

                    } else {
                        ++tail;
                        haveContent = true;
                    }

                    break;
                }

                case "-": { // Possible single line comment.
                    const temp = tail + 2;
                    if (sql[tail + 1] === "-" && (sql[temp] === " " || sql[temp] === "\t" || sql[temp] === "\n")) {
                        // Skip everything until the end of the line.
                        tail += 2;
                        while (tail < end && sql[tail] !== "\n") {
                            ++tail;
                        }

                        if (tail === end) { // Unfinished single line comment.
                            result.push({
                                delimiter,
                                span: { start, length: tail - start },
                                contentStart: haveContent ? head : start,
                                state: StatementFinishState.OpenComment,
                            });
                            start = tail;
                            head = tail;

                            break;
                        }

                        if (!haveContent) {
                            head = tail;
                        }
                    } else {
                        ++tail;
                        haveContent = true;
                    }

                    break;
                }

                case "#": { // MySQL single line comment.
                    while (tail < end && sql[tail] !== "\n") {
                        ++tail;
                    }

                    if (tail === end) { // Unfinished single line comment.
                        result.push({
                            delimiter,
                            span: { start, length: tail - start },
                            contentStart: haveContent ? head : start,
                            state: StatementFinishState.OpenComment,
                        });
                        start = tail;
                        head = tail;

                        break;
                    }

                    if (!haveContent) {
                        head = tail;
                    }

                    break;
                }

                case '"':
                case "'":
                case "`": { // Quoted string/id. Skip this in a local loop.
                    haveContent = true;
                    const quote = sql[tail++];
                    while (tail < end && sql[tail] !== quote) {
                        // Skip any escaped character too.
                        if (sql[tail] === "\\") {
                            ++tail;
                        }
                        ++tail;
                    }

                    if (sql[tail] === quote) {
                        ++tail; // Skip trailing quote char if one was there.
                    } else { // Unfinished single string.
                        result.push({
                            delimiter,
                            span: { start, length: tail - start },
                            contentStart: haveContent ? head : start,
                            state: StatementFinishState.OpenString,
                        });
                        start = tail;
                        head = tail;
                    }

                    break;
                }

                case "d":
                case "D": {
                    // Possible start of the DELIMITER word. Also consider the mandatory space char.
                    if (tail + 10 >= end) {
                        if (!haveContent) {
                            haveContent = true;
                            head = tail;
                        }
                        ++tail;
                        break; // Not enough input for that.
                    }

                    const candidate = sql.substring(tail, tail + 10);
                    if (candidate.match(delimiterKeyword)) {
                        // Delimiter keyword found - get the new delimiter (all consecutive letters).
                        // But first push anything we found so far and haven't pushed yet.
                        if (haveContent && tail > start) {
                            result.push({
                                delimiter,
                                span: { start, length: tail - start },
                                contentStart: head,
                                state: StatementFinishState.NoDelimiter,
                            });
                            start = tail;
                        }

                        head = tail;
                        tail += 10;
                        let run = tail;

                        // Skip leading spaces + tabs.
                        while (run < end && (sql[run] === " " || sql[run] === "\t")) {
                            ++run;
                        }
                        tail = run;

                        // Forward to the first whitespace after the current position (on this line).
                        while (run < end && sql[run] !== "\n" && sql[run] !== " " && sql[run] !== "\t") {
                            ++run;
                        }

                        delimiter = sql.substring(tail, run);
                        const length = delimiter.length;
                        if (length > 0) {
                            tail += length - delimiter.length;

                            result.push({
                                delimiter,
                                span: { start, length: run - start },
                                contentStart: head,
                                state: StatementFinishState.DelimiterChange,
                            });

                            tail = run;
                            head = tail;
                            start = head;
                            haveContent = false;
                        } else {
                            haveContent = true;
                            head = tail;
                        }
                    } else {
                        ++tail;

                        if (!haveContent) {
                            haveContent = true;
                            head = tail;
                        }
                    }

                    break;
                }

                default:
                    if (!haveContent && sql[tail] > " ") {
                        haveContent = true;
                        head = tail;
                    }
                    ++tail;

                    break;
            }
        }
    }

    // Add remaining text to the range list.
    if (head < end) {
        result.push({
            span: { start, length: end - start },
            contentStart: haveContent ? head : start - 1, // -1 to indicate no content
            state: StatementFinishState.NoDelimiter,
        });
    }

    return result;
};

/**
 * Determines if the version info in the statement matches the given version (if there's version info at all).
 * The version info is removed from the statement, if any.
 *
 * @param statement The statement with an optional version part at the beginning.
 * @param serverVersion The server version to match the version part against.
 *
 * @returns The check result.
 */
export const checkStatementVersion = (statement: string, serverVersion: number): IVersionCheckResult => {
    const result: IVersionCheckResult = {
        matched: true,
        statement,
        version: serverVersion,
    };

    const matches = statement.match(versionPattern);
    if (matches) {
        result.statement = statement.replace(versionPattern, "");

        const relation = matches[1];
        result.version = parseInt(matches[2], 10);

        switch (relationMap.get(relation)) {
            case 0: {
                if (serverVersion >= result.version) {
                    result.matched = false;
                }
                --result.version;

                break;
            }

            case 1: {
                if (serverVersion > result.version) {
                    result.matched = false;
                }
                break;
            }

            case 2: {
                if (serverVersion !== result.version) {
                    result.matched = false;
                }
                break;
            }

            case 3: {
                if (serverVersion < result.version) {
                    result.matched = false;
                }
                break;
            }

            case 4: {
                if (serverVersion <= result.version) {
                    result.matched = false;
                }
                ++result.version;

                break;
            }

            default:
        }
    }

    return result;
};

/** The list of files with content to parse. */
const testFiles: ITestFile[] = [
    // Large set of all possible query types in different combinations and versions.
    { name: "../../data/statements.txt", initialDelimiter: "$$" },

    // The largest of the example files from the grammar repository:
    // (https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples)
    { name: "../../data/bitrix_queries_cut.sql", initialDelimiter: ";" },

    // Not so many, but some very long insert statements.
    { name: "../../data/sakila-db/sakila-data.sql", initialDelimiter: ";" },
];

/**
 * Runs through the file list and parses all contained statements.
 *
 * @param parseService The service to use for parsing.
 * @param clearDFA If true the DFA is cleared before each file is parsed.
 */
const parseFiles = (parseService: IParseService, clearDFA: boolean) => {
    testFiles.forEach((entry) => {
        const sql = fs.readFileSync(path.join(runnerPath, entry.name), { encoding: "utf-8" });
        const ranges = determineStatementRanges(sql, entry.initialDelimiter);

        if (clearDFA) {
            // Reset the DFA for each file, to measure the cold state of the parser for each of them (if said so).
            parseService.clearDFA();
        }

        //console.log("    Found " + ranges.length + " statements in " + entry.name + ".");

        let tokenizationTime = 0;
        let parseTime = 0;
        ranges.forEach((range, index) => {
            // The delimiter is considered part of the statement (e.g. for editing purposes)
            // but must be ignored for parsing.
            const end = range.span.start + range.span.length - (range.delimiter?.length ?? 0);
            const statement = sql.substring(range.span.start, end).trim();

            // The parser only supports syntax from 8.0 onwards. So we expect errors for older statements.
            const checkResult = checkStatementVersion(statement, 80400);
            if (checkResult.matched) {
                let localTimestamp = performance.now();
                parseService.tokenize(checkResult.statement, checkResult.version, "ANSI_QUOTES");
                tokenizationTime += performance.now() - localTimestamp;

                let error: IParserErrorInfo | undefined;
                localTimestamp = performance.now();
                const result = parseService.errorCheck();
                parseTime += performance.now() - localTimestamp;
                if (!result) {
                    const errors = parseService.errorsWithOffset(0);
                    error = errors[0];
                }

                if (error) {
                    throw new Error(`This query failed to parse (${index}: ${checkResult.version}):\n${statement}\n` +
                        `with error: ${error.message}, line: ${error.line - 1}, column: ${error.offset}`);
                }
            } else {
                // Ignore all other statements. Since we don't check for versions below 8.0 in the grammar they
                // may unexpectedly succeed.
            }
        });

        console.log(`    ${path.basename(entry.name)}: ${Math.round(tokenizationTime)} ms, ` +
            `${Math.round(parseTime)} ms`);
    });
};

/**
 * This is the main entry point for the benchmark. It runs the parser for all test files and measures the time.
 * Overall there are 6 parse runs (one as cold run when the runtime hasn't warmed up, and 5 others to test the
 * warm runtime).
 *
 * @param title A title for the benchmark.
 * @param parseService The service to use for parsing.
 * @param rounds The number of rounds to run (the wasm target cannot run 6 times, without crashing Node).
 */
export const runBenchmark = (title: string, parseService: IParseService, rounds: number): void => {
    console.log("begin benchmark: " + title);

    parseFiles(parseService, true);
    for (let i = 0; i < rounds - 1; ++i) {
        parseFiles(parseService, false);
    }

    console.log("end benchmark: " + title + "\n");
};
