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

import { type IParseService, type IParserErrorInfo } from "./types";

const runnerPath = path.dirname(fileURLToPath(import.meta.url));

/**
 * Allows to wait for the next Node.js run loop, after all I/O tasks, micro tasks and tick callbacks were processed.
 *
 * @returns A promise which fulfills when setTimeout callbacks are executed (which are the last tasks in a run loop).
 */
export const nextRunLoop = async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
};

/** The list of files with content to parse. */
const testFiles: string[] = [
    // Large set of all possible query types in different combinations and versions.
    "../../data/statements.txt",

    // The largest of the example files from the grammar repository:
    // (https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples)
    "../../data/bitrix_queries_cut.sql",

    // Not so many, but some very long insert statements.
    "../../data/sakila-db/sakila-data.sql",
];

/**
 * Runs through the file list and parses all contained statements.
 *
 * @param parseService The service to use for parsing.
 * @param clearDFA If true the DFA is cleared before each file is parsed.
 */
const parseFiles = async (parseService: IParseService, clearDFA: boolean) => {
    for (const fileName of testFiles) {
        const sql = fs.readFileSync(path.join(runnerPath, fileName), { encoding: "utf-8" });
        const statements = sql.split("$$$");

        if (clearDFA) {
            // Reset the DFA for each file, to measure the cold state of the parser for each of them (if said so).
            parseService.clearDFA();
        }

        let tokenizationTime = 0;
        let parseTime = 0;
        for (let i = 0; i < statements.length; ++i) {
            const statement = statements[i];

            let localTimestamp = performance.now();
            parseService.tokenize(statement, 80400, "ANSI_QUOTES");
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
                throw new Error(`This query failed to parse:\n${statement}\n` +
                    `with error: ${error.message}, line: ${error.line - 1}, column: ${error.offset}`);
            }

            if (i % 30 === 0) {
                // Yield some time to the event loop every 30 statements. This allows progress indicators to update.
                // Don't do that too often, though, as it has a performance impact.
                await nextRunLoop();
            }
        }

        console.log(`    ${path.basename(fileName)}: ${Math.round(tokenizationTime)} ms, ` +
            `${Math.round(parseTime)} ms`);
    }
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
export const runBenchmark = async (title: string, parseService: IParseService, rounds: number): Promise<void> => {
    console.log("begin benchmark: " + title);

    await parseFiles(parseService, true);
    for (let i = 0; i < rounds - 1; ++i) {
        await parseFiles(parseService, false);
    }

    console.log("end benchmark: " + title + "\n");
};
