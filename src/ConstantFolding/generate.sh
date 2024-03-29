# Generates the MySQL parser + lexer files for the benchmarks.

# C++
java -jar ../../antlr/antlr-4.13.1-complete.jar \
    -Dlanguage=Cpp -o ./targets/antlr4-cpp -no-visitor -no-listener -package parsers -Xexact-output-dir -Werror \
    ./targets/P.g4

# ANTLR4 main TypeScript
java -jar ../../antlr/antlr-4.13.1-complete.jar \
    -Dlanguage=TypeScript -o ./targets/antlr4 -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/P.g4

# antlr4ng
antlr4ng \
    -Dlanguage=TypeScript -o ./targets/antlr4ng -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/P.g4

# antlr4ts
antlr4ts \
    -o ./targets/antlr4ts -no-visitor -no-listener -package antlr4 -Xexact-output-dir -Werror \
    ./targets/P.g4
