/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Shared code for all TypeScript runtimes.
 */

import { performance } from "perf_hooks";

import { type IParseService } from "./types";

/** Input to parse. */
const inputLines: string[] = [];

const inputElements: string[] = [];
for (let i = 0; i < 64; ++i) {
    inputElements.push(`T${i}`);
}

// Add one line with 64 tokens.
inputLines.push(inputElements.join(" "));

// Add more lines with the same tokens but in random order.
for (let i = 0; i < 10000; ++i) {
    const shuffled = inputElements.slice();
    shuffled.sort(() => { return Math.random() - 0.5; });
    inputLines.push(shuffled.join(" "));
}

const input = inputLines.join(" ");

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

/**
 * Runs through the file list and parses all contained statements.
 *
 * @param parseService The service to use for parsing.
 * @param clearDFA If true the DFA is cleared before each file is parsed.
 */
const parse = (parseService: IParseService, clearDFA: boolean): void => {
    if (clearDFA) {
        // Reset the DFA for each file, to measure the cold state of the parser for each of them (if said so).
        parseService.clearDFA();
    }

    let tokenizationTime = 0;
    let parseTime = 0;

    let localTimestamp = performance.now();
    parseService.tokenize(input);
    tokenizationTime += performance.now() - localTimestamp;

    localTimestamp = performance.now();
    const result = parseService.errorCheck();
    parseTime += performance.now() - localTimestamp;

    if (!result) {
        throw new Error(`Parse error encountered.`);
    }

    console.log(`    input: ${Math.round(tokenizationTime)} ms, ${Math.round(parseTime)} ms`);
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

    parse(parseService, true);
    for (let i = 0; i < rounds - 1; ++i) {
        parse(parseService, false);
    }

    console.log("end benchmark: " + title + "\n");
};
