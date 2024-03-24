/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { exec } from "child_process";
import util from "util";

/**
 * This file is used to run all benchmarks for the MySQL parser. It captures the output of each benchmark
 * and computes average times for each target.
 *
 * These numbers are then used to update the benchmark results in the readme.md file.
 */

type TargetResults = Map<string, Array<[number, number]>>;

const targetMap = new Map<string, TargetResults>();

/**
 * Function to display a spinner animation
 *
 * @returns The interval that can be used to stop the spinner.
 */
const startSpinner = () => {
    const spinner = ["/", "-", "\\", "|"];
    let i = 0;

    return setInterval(() => {
        process.stdout.write("\r" + spinner[i++]);
        i &= 3; // This will cycle through the spinner array
    }, 100);
};

/**
 * Function to stop the spinner and clear the line
 * @param spinnerInterval
 */
const stopSpinner = (spinnerInterval: NodeJS.Timeout) => {
    clearInterval(spinnerInterval);
    process.stdout.write("\r");
};

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

// Start with the C++ target.
process.stdout.write("  Running C++ benchmark...");

const execAsync = util.promisify(exec);

const spinnerInterval = startSpinner();
const { stdout } = await execAsync("./mysql-benchmark", { cwd: "targets/antlr4-cpp" });
stopSpinner(spinnerInterval);

const result = stdout.toString().trim();
const parsed = parseOutput(result);
if (parsed) {
    targetMap.set(parsed[0], parsed[1]);
}
