/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ParseService } from "./ParseService.js";

import { runBenchmark } from "../misc/typescript-runner.js";

const parseService = new ParseService();
await runBenchmark("antlr4", parseService, 6);
