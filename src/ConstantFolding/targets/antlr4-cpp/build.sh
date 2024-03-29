clang++ \
    PLexer.cpp\
    PParser.cpp\
    ParseServiceCpp.cpp\
    main.cpp\
    -O3\
    -std=c++17 -I../../../../antlr4-cpp-runtime/headers/\
    -L ../../../../antlr4-cpp-runtime/lib -l antlr4-runtime\
    -o constant-folding-benchmark
