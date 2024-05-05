package misc;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

public class RunBenchmark {

    private static String[] testFiles = {
        // Large set of all possible query types in different combinations and versions.
        "../../data/statements.txt",

        // The largest of the example files from the grammar repository:
        // (https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples)
        "../../data/bitrix_queries_cut.sql",

        // Not so many, but some very long insert statements.
        "../../data/sakila-db/sakila-data.sql",
    };

    private static void parseFiles(ParseService parseService, boolean clearDFA) throws FileNotFoundException {
        for (String testFile : testFiles) {

            String contents = new Scanner(new File(testFile)).useDelimiter("\\Z").next();
            String[] statements = contents.split("\\$\\$\\$");

            if (clearDFA) {
                // Reset the DFA for each file, to measure the cold state of the parser for each of them (if said so).
                parseService.clearDFA();
            }

            long tokenizationTime = 0;
            long parseTime = 0;

            for (String statement : statements) {
                long localTimestamp = System.currentTimeMillis();
                parseService.tokenize(statement, 80400, "ANSI_QUOTES");
                tokenizationTime += System.currentTimeMillis() - localTimestamp;

                localTimestamp = System.currentTimeMillis();
                ParserErrorInfo error = null;
                boolean result = parseService.errorCheck();
                parseTime += System.currentTimeMillis() - localTimestamp;

                if (!result) {
                    List<ParserErrorInfo>  errors = parseService.errorsWithOffset(0);
                    error = errors.size() > 0 ? errors.get(0) : null;
                }

                if (error != null) {
                    throw new RuntimeException(
                            String.format("This query failed to parse:\n%s\nwith error %s, line: %s, column: %s",
                                    statement, error.message, error.line - 1, error.column));
                }
            }

            System.out.println(String.format("%s: %s ms, %s ms", testFile, tokenizationTime, parseTime));
        }
    }

    public static void main(String[] args) throws FileNotFoundException {

        final ParseService parseService = new ParseServiceImpl();
        final String title = "java";
        final int rounds = 6;

        System.out.println("begin benchmark: " + title);

        parseFiles(parseService, true);

        for (int i = 0; i < rounds - 1; i++) {
            parseFiles(parseService, false);
        }

        System.out.println("end benchmark: " + title);
    }
}


