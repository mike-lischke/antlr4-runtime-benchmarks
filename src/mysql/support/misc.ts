/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export type TargetResults = Map<string, Array<[number, number]>>; // File name -> [lexing time, parsing time]
export const targetMap = new Map<string, TargetResults>(); // Target name -> TargetResults

/** One set of results per target and test file. */
export interface IResultEntry {
    lexing: number;
    parsing: number;
    total: number;
}

/** A set of results for one target. */
export interface IResultLine {
    /** The name of the target. */
    target: string;

    /** The results for all test files. */
    results: IResultEntry[];
}

/**
 * Function to display a spinner animation
 *
 * @returns The interval that can be used to stop the spinner.
 */
export const startSpinner = (): NodeJS.Timeout => {
    const spinner = ["/", "-", "\\", "|"];
    let i = 0;

    process.stdout.write("\u001B[?25l"); // Hide the cursor.

    return setInterval(() => {
        process.stdout.write("\r" + spinner[i++]);
        i &= 3; // This will cycle through the spinner array
    }, 100);
};

/**
 * Function to stop the spinner and clear the line
 *
 * @param spinnerInterval The interval to stop.
 */
export const stopSpinner = (spinnerInterval: NodeJS.Timeout): void => {
    clearInterval(spinnerInterval);
    process.stdout.write("\r✔\n");
    process.stdout.write("\u001B[?25h"); // Show the cursor again.
};
