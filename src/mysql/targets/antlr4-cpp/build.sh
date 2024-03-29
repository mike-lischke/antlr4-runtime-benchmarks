clang++ \
    MySQLBaseLexer.cpp\
    MySQLBaseRecognizer.cpp\
    MySQLLexer.cpp\
    MySQLParser.cpp\
    MySQLParserBaseListener.cpp\
    MySQLParserBaseVisitor.cpp\
    MySQLParserListener.cpp\
    MySQLParserVisitor.cpp\
    MySQLRecognizerCommon.cpp\
    parsers-common.cpp\
    ParseServiceCpp.cpp\
    main.cpp\
    -O3\
    -std=c++17 -I../../../../antlr4-cpp-runtime/headers/\
    -L ../../../../antlr4-cpp-runtime/lib -l antlr4-runtime\
    -o mysql-benchmark
