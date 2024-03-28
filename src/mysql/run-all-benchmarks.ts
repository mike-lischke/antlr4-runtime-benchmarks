/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import util from "util";

import {
    startSpinner, stopSpinner, targetMap, type IResultEntry, type IResultLine, type TargetResults,
} from "./support/misc";

/**
 * This file is used to run all benchmarks for the MySQL parser. It captures the output of each benchmark
 * and computes average times for each target and each test file.
 *
 * These numbers are then used to update the benchmark results in the readme.md file.
 */

/**
 * Extracts the name of the benchmark and the execution times. The output is structured as follows:
 *
 *     begin benchmark: <name>
 *         <file name>: <lexing time> ms, <parsing time> ms
 *        ...
 *    end benchmark: <name>
 *
 * @param output The output of the benchmark.
 *
 * @returns The name of the benchmark and the execution times.
 */
const parseOutput = (output: string): [string, TargetResults] | undefined => {
    const lines = output.split("\n");

    // Validate that we have a valid output.
    if (lines.length < 3) {
        return;
    }

    const header = lines[0].split(":");
    const footer = lines[lines.length - 1].split(":");
    if (header.length !== 2 || header[0].trim() !== "begin benchmark"
        || footer.length !== 2 || footer[0].trim() !== "end benchmark") {
        return;
    }

    const name = header[1].trim();
    const times: TargetResults = new Map(); // File name -> [lexing time, parsing time]
    lines.slice(1, -1).forEach((line) => {
        const parts = line.split(":");
        if (parts.length === 2) {
            const fileName = parts[0].trim();
            const timeParts = parts[1].split(",");
            if (timeParts.length === 2) {
                if (!times.has(fileName)) {
                    times.set(fileName, []);
                }
                times.get(fileName)!.push([parseFloat(timeParts[0]), parseFloat(timeParts[1])]);
            }
        }
    });

    return [name, times];
};

/**
 * Runs the TypeScript benchmark with the given name.
 *
 * @param name The name of the benchmark to run.
 */
const runTypeScriptBenchmark = async (name: string) => {
    return new Promise<void>((resolve) => {
        let logBuffer = "";

        const log = console.log;
        console.log = (message: string) => {
            logBuffer += message + "\n";
        };

        process.stdout.write(`\n  Running the ${name} benchmark...`);
        const spinnerInterval = startSpinner();
        void import(`./targets/${name}/run-benchmark.js`).then(() => {
            stopSpinner(spinnerInterval);

            const result = logBuffer.trim();
            const parsed = parseOutput(result);
            if (parsed) {
                targetMap.set(parsed[0], parsed[1]);
            }

            console.log = log;
            resolve();
        });
    });
};

console.log("\nCrunching performance numbers for various ANTLR4 runtimes\n");

// Start with the C++ target.
process.stdout.write("  Running the C++ benchmark...");

const execAsync = util.promisify(exec);

const spinnerInterval = startSpinner();
const { stdout } = await execAsync("./mysql-benchmark", { cwd: "targets/antlr4-cpp" });
stopSpinner(spinnerInterval);

const result = stdout.toString().trim();
const parsed = parseOutput(result);
if (parsed) {
    targetMap.set(parsed[0], parsed[1]);
}

// Next all the TypeScript targets.
await runTypeScriptBenchmark("antlr4ng");
await runTypeScriptBenchmark("antlr4ts");
await runTypeScriptBenchmark("antlr4");
await runTypeScriptBenchmark("antlr4wasm");

// Process the collected results and generate the output structure.

// This is the list of test files we expect to see in the results, in this order.
const expectedFiles = ["statements.txt", "bitrix_queries_cut.sql", "sakila-data.sql"];

const resultTableCold: IResultLine[] = [];
const resultTableWarm: IResultLine[] = [];

targetMap.forEach((results, target) => {
    const coldResults: IResultEntry[] = [];
    const warmResults: IResultEntry[] = [];

    let totalLexerCold = 0;
    let totalParserCold = 0;
    let totalCold = 0;

    let totalLexerWarm = 0;
    let totalParserWarm = 0;
    let totalWarm = 0;
    expectedFiles.forEach((expectedFile) => {
        const fileResult = results.get(expectedFile);
        if (!fileResult) {
            console.error(`Missing result for ${expectedFile} in ${target}`);

            return;
        }

        // The first entry is the cold run, the rest is warm.
        const lexerCold = fileResult[0][0];
        totalLexerCold += lexerCold;
        const parserCold = fileResult[0][1];
        totalParserCold += parserCold;

        // Sort the remaining list.
        let warm = fileResult.slice(1).sort((a, b) => { return (b[0] + b[1]) - (a[0] + a[1]); });

        // Remove the first two entries if we have more than 4 warmup runs (which are the slowest ones).
        const restStart = warm.length > 4 ? 2 : 0;
        warm = warm.slice(restStart);

        // Compute the average of the remaining runs.
        const lexerWarm = warm.reduce((acc, val) => {
            return acc + val[0];
        }, 0) / Math.max(1, warm.length);
        totalLexerWarm += lexerWarm;

        const parserWarm = warm.reduce((acc, val) => {
            return acc + val[1];
        }, 0) / Math.max(1, warm.length);
        totalParserWarm += parserWarm;

        const coldSum = lexerCold + parserCold;
        const warmSum = lexerWarm + parserWarm;

        totalCold += coldSum;
        totalWarm += warmSum;

        coldResults.push({ lexing: lexerCold, parsing: parserCold, total: coldSum });
        warmResults.push({ lexing: lexerWarm, parsing: parserWarm, total: warmSum });
    });

    // Add the total times.
    coldResults.push({ lexing: totalLexerCold, parsing: totalParserCold, total: totalCold });
    warmResults.push({ lexing: totalLexerWarm, parsing: totalParserWarm, total: totalWarm });

    resultTableWarm.push({ target, results: warmResults });
    resultTableCold.push({ target, results: coldResults });
});

// Sort the result tables by the total time.
resultTableCold.sort((a, b) => {
    return a.results[a.results.length - 1].total - b.results[b.results.length - 1].total;
});

resultTableWarm.sort((a, b) => {
    return a.results[a.results.length - 1].total - b.results[b.results.length - 1].total;
});

// Finally generate a new readme.md file from the template and the collected results.
const template = readFileSync("readme-template.md", "utf8");

const lines: string[] = [];

resultTableCold.forEach((line) => {
    const cells: string[] = [line.target];
    line.results.forEach((entry) => {
        cells.push(`${Math.round(entry.lexing)}⧸${Math.round(entry.parsing)}⧸${Math.round(entry.total)}`);
    });
    lines.push(`|${cells.join("|")}|`);
});
let readme = template.replace("⫸cold table⫷", lines.join("\n"));

lines.length = 0;

resultTableWarm.forEach((line) => {
    const cells: string[] = [line.target];
    line.results.forEach((entry) => {
        cells.push(`${Math.round(entry.lexing)}⧸${Math.round(entry.parsing)}⧸${Math.round(entry.total)}`);
    });
    lines.push(`|${cells.join("|")}|`);
});
readme = readme.replace("⫸warm table⫷", lines.join("\n"));

writeFileSync("readme.md", readme);
console.log("\nDone.\n");
