/*
 * Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2.0,
 * as published by the Free Software Foundation.
 *
 * This program is also distributed with certain software (including
 * but not limited to OpenSSL) that is licensed under separate terms, as
 * designated in a particular file or component or in included license
 * documentation. The authors of MySQL hereby grant you an additional
 * permission to link the program and your derivative works with the
 * separately licensed software that they have included with MySQL.
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
 * the GNU General Public License, version 2.0, for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */

#include "MySQLLexer.h"
#include "MySQLParser.h"

#include "MySQLRecognizerCommon.h"

using namespace parsers;

using namespace antlr4;
using namespace antlr4::tree;
using namespace antlr4::dfa;

bool MySQLRecognizerCommon::isSqlModeActive(size_t mode) {
  return (sqlMode & mode) != 0;
}

static void trim(std::string &s) {
  std::locale locale;
  s.erase(s.begin(), std::find_if_not(s.begin(), s.end(), [&locale](char c) { return std::isspace(c, locale); }));
  s.erase(std::find_if_not(s.rbegin(), s.rend(), [&locale](char c) { return std::isspace(c, locale); }).base(),
          s.end());
}

void MySQLRecognizerCommon::sqlModeFromString(std::string modes) {
  sqlMode = NoMode;

  for (auto &c : modes)
    c = toupper(c);
  std::istringstream iss(modes);
  std::string mode;
  while (std::getline(iss, mode, ',')) {
    trim(mode);
    if (mode == "ANSI" || mode == "DB2" || mode == "MAXDB" || mode == "MSSQL" || mode == "ORACLE" ||
        mode == "POSTGRESQL")
      sqlMode = SqlMode(sqlMode | AnsiQuotes | PipesAsConcat | IgnoreSpace);
    else if (mode == "ANSI_QUOTES")
      sqlMode = SqlMode(sqlMode | AnsiQuotes);
    else if (mode == "PIPES_AS_CONCAT")
      sqlMode = SqlMode(sqlMode | PipesAsConcat);
    else if (mode == "NO_BACKSLASH_ESCAPES")
      sqlMode = SqlMode(sqlMode | NoBackslashEscapes);
    else if (mode == "IGNORE_SPACE")
      sqlMode = SqlMode(sqlMode | IgnoreSpace);
    else if (mode == "HIGH_NOT_PRECEDENCE" || mode == "MYSQL323" || mode == "MYSQL40")
      sqlMode = SqlMode(sqlMode | HighNotPrecedence);
  }
}
