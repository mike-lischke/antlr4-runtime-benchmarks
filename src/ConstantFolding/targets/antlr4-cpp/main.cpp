/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>
#include <chrono>

#include "antlr4-runtime.h"
#include "ParseServiceCpp.h"

using namespace parsers;
using namespace antlr4;
using namespace antlr4::atn;
using namespace antlr4::tree;

std::shared_ptr<ParseServiceCpp> service = std::make_shared<ParseServiceCpp>();

/** Shuffle the elements of a vector. */
void shuffleVector(std::vector<std::string>& vec) {
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    std::shuffle(vec.begin(), vec.end(), std::default_random_engine(seed));
}

/** Join the elements of a vector using the given delimiter. */
std::string joinVector(const std::vector<std::string>& vec, const std::string& delimiter) {
    std::string result;
    for (size_t i = 0; i < vec.size(); ++i) {
        result += vec[i];
        if (i < vec.size() - 1) {
            result += delimiter;
        }
    }
    return result;
}

std::vector<std::string> inputLines;
std::vector<std::string> inputElements;
std::string input;

void parse(bool clearDFA) {
    if (clearDFA) {
        service->clearDFA();
    }

    double tokenizationTime = 0;
    double parseTime = 0;

    auto start = std::chrono::high_resolution_clock::now();
    service->tokenize(input);
    auto stop = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
    tokenizationTime += duration.count();

    start = std::chrono::high_resolution_clock::now();
    bool succeeded = service->errorCheck();
    stop = std::chrono::high_resolution_clock::now();
    duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
    parseTime += duration.count();

    if (!succeeded) {
        throw "Parse error encountered.";
    }

    tokenizationTime = std::round(tokenizationTime / 1000.0);
    parseTime = std::round(parseTime / 1000.0);
    std::cout << "    input: " << tokenizationTime << " ms, " << parseTime << " ms" << std::endl;
}

int main(int, const char **) {
    // Populate inputElements with "T" values from 0 to 63.
    for (int i = 0; i < 64; ++i) {
        inputElements.push_back("T" + std::to_string(i));
    }

    // Add one line with 64 tokens.
    inputLines.push_back(joinVector(inputElements, " "));

    // Add more lines with the same tokens but in random order.
    for (int i = 0; i < 10000; ++i) {
        std::vector<std::string> shuffled = inputElements; // Copy inputElements
        shuffleVector(shuffled);
        inputLines.push_back(joinVector(shuffled, " "));
    }

    // Join all lines into a single string.
    input = joinVector(inputLines, " ");

    std::cout << "begin benchmark: antlr4-cpp" << std::endl;

    parse(true);
    for (auto i = 0; i < 5; ++i) {
        parse(false);
    }

    std::cout << "end benchmark: antlr4-cpp" << std::endl << std::endl;

    return 0;
}
