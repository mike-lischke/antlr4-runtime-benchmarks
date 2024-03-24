# Generates the MySQL parser + lexer files for the benchmarks.

# C++
java -jar ../../antlr/antlr-4.13.1-complete.jar \
    -Dlanguage=Cpp -o ./targets/antlr4-cpp -no-visitor -no-listener -package parsers -Xexact-output-dir -Werror \
    ./targets/antlr4-cpp/MySQLLexer.g4 ./targets/antlr4-cpp/MySQLParser.g4

# WebAssembly
java -jar ../../antlr/antlr4-4.13.1-SNAPSHOT-complete.jar \
    -Dlanguage=TypeScript -o ./targets/antlr4wasm -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/antlr4wasm/MySQLLexer.g4 ./targets/antlr4wasm/MySQLParser.g4

# Old TypeScript
java -jar ../../antlr/antlr-4.13.1-complete.jar \
    -Dlanguage=TypeScript -o ./targets/antlr4 -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/antlr4/MySQLLexer.g4 ./targets/antlr4/MySQLParser.g4

# New TypeScript
antlr4ng \
    -Dlanguage=TypeScript -o ./targets/antlr4ng -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/antlr4ng/MySQLLexer.g4 ./targets/antlr4ng/MySQLParser.g4

# antlr4ts
antlr4ts \
    -o ./targets/antlr4ts -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/antlr4ts/MySQLLexer.g4 ./targets/antlr4ts/MySQLParser.g4
