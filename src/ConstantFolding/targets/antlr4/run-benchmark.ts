/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { runBenchmark } from "../misc/typescript-runner.js";
import { ParseService } from "./ParseService.js";

const parseService = new ParseService();
runBenchmark("antlr4", parseService, 6);
