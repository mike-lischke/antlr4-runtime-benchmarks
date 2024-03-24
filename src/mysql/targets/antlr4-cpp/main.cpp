/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

#include <iostream>
#include <regex>
#include <string>
#include <algorithm>

#include "antlr4-runtime.h"
#include "MySQLLexer.h"
#include "MySQLParser.h"
#include "ParseServiceCpp.h"

using namespace parsers;
using namespace antlr4;
using namespace antlr4::atn;
using namespace antlr4::tree;

std::shared_ptr<ParseServiceCpp> service = std::make_shared<ParseServiceCpp>(80400);

struct TestFile {
  std::string name;
  const char *line_break;
  const char *initial_delimiter;
};

static const std::vector<TestFile> testFiles = {
  // Large set of all possible query types in different combinations and versions.
  { "statements.txt", "\n", "$$" },

  // The largest of the example files from the grammar repository:
  // (https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples)
  { "bitrix_queries_cut.sql", "\n", ";" },

  // Not so many, but some very long insert statements.
  { "sakila-db/sakila-data.sql", "\n", ";" }
};

std::string basename(const std::string& path, const std::string& extension = "") {
    // Find the last slash
    size_t lastSlash = path.find_last_of("/\\");
    std::string filename = (lastSlash == std::string::npos) ? path : path.substr(lastSlash + 1);

    // Remove the extension if provided
    if (!extension.empty()) {
        size_t extPos = filename.rfind(extension);
        if (extPos != std::string::npos && extPos == filename.size() - extension.size()) {
            filename = filename.substr(0, extPos);
        }
    }

    return filename;
}

/**
 * Determines if the version info in the statement matches the given version (if there's version info at all).
 * The version info is removed from the statement, if any.
 */
static bool versionMatches(std::string &statement, unsigned long serverVersion) {
  static std::regex versionPattern("^\\[(<|<=|>|>=|=)(\\d{5})\\]");
  static std::map<std::string, int> relationMap = { { "<", 0 }, { "<=", 1 }, { "=", 2 }, { ">=", 3 }, { ">", 4 } };

  std::smatch matches;
  if (std::regex_search(statement, matches, versionPattern)) {
    auto relation = matches[1].str();
    unsigned long targetVersion = std::stoul(matches[2].str());

    switch (relationMap[relation]) {
      case 0:
        if (serverVersion >= targetVersion)
          return false;
        break;
      case 1:
        if (serverVersion > targetVersion)
          return false;
        break;
      case 2:
        if (serverVersion != targetVersion)
          return false;
        break;
      case 3:
        if (serverVersion < targetVersion)
          return false;
        break;
      case 4:
        if (serverVersion <= targetVersion)
          return false;
        break;
    }

    statement = std::regex_replace(statement, versionPattern, "");
  }

  return true;
}

void parseFiles(bool clearDFA) {
  auto index = 0;
  for (auto entry : testFiles) {
    std::string fileName = "../../data/" + entry.name;

#ifdef _MSC_VER
    std::ifstream stream(base::string_to_wstring(fileName), std::ios::binary);
#else
    std::ifstream stream(fileName, std::ios::binary);
#endif
    std::string sql((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());

    std::vector<StatementRange> ranges;
    service->determineStatementRanges(sql.c_str(), sql.size(), entry.initial_delimiter, ranges, entry.line_break);

    if (clearDFA) {
      service->clearDFA();
    }

    double tokenizationTime = 0;
    double parseTime = 0;
    for (auto &range : ranges) {
      std::string statement(sql.c_str() + range.start, range.length);

      if (versionMatches(statement, 80400)) {
        auto start = std::chrono::high_resolution_clock::now();
        service->tokenize(statement);
        auto stop = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
        tokenizationTime += duration.count();

        start = std::chrono::high_resolution_clock::now();
        bool succeeded = service->errorCheck();
        stop = std::chrono::high_resolution_clock::now();
        duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
        parseTime += duration.count();

        if (!succeeded) {
          throw "This query failed to parse:\n" + statement;
        }
      }
    }

    tokenizationTime = std::round(tokenizationTime / 1000.0);
    parseTime = std::round(parseTime / 1000.0);
    std::cout << "    " << basename(entry.name) << ": "
        << tokenizationTime << " ms, " << parseTime << " ms" << std::endl;
  }
}

int main(int, const char **) {
  std::cout << "begin benchmark: antlr4-cpp" << std::endl;

  parseFiles(true);
  for (auto i = 0; i < 5; ++i) {
      parseFiles(false);
  }

  std::cout << "end benchmark: antlr4-cpp" << std::endl << std::endl;

  return 0;
}
