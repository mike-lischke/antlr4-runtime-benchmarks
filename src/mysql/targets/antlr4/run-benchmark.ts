/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { ParseService } from "./ParseService.js";

import { runBenchmark } from "../misc/typescript-runner.js";

const benchmarkPath = path.dirname(fileURLToPath(import.meta.url));

const charSets = new Set<string>();
const content = fs.readFileSync(path.join(benchmarkPath, "../../data/rdbms-info.json"), { encoding: "utf-8" });
const rdbmsInfo = JSON.parse(content) as { characterSets: { [name: string]: string; }; };
Object.keys(rdbmsInfo.characterSets).forEach((set: string) => {
    charSets.add("_" + set.toLowerCase());
});

const parseService = new ParseService(charSets);
await runBenchmark("antlr4", parseService, 6);
