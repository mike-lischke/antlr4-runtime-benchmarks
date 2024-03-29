# Benchmarking ANTLR4 With Different Runtimes And Grammars

This repository consists of various benchmarks that are used to measure the performance of certain ANTLR4 runtimes. Currently there's only one benchmark group: MySQL parser benchmarks (using the official MySQL grammar). In a later version I hope to add more groups with different characteristics than SQL code parsing.

Each set of grammar benchmarks is located in an own sub folder (with the name of the grammar) of the `src` directory. Building and executing the benchmarks is managed by various scripts to make it as easy as possible for everyone to do their own comparsions.

There's an own readme file for each grammar, explaining the installation details and listing the latest results. The general idea for all benchmarks is to do only the absolute minimum to measure the time a script or binary needs to parse specific input for a given grammar. No third party (test/benchmark) libraries or anything not directly related to building a runnable parser should be involved, to maintain a low entry point for everyone interested in running the benchmarks on their own boxes. 

It's not needed to measure times in micro seconds or even smaller time units, for a comparison. Instead the input should be complex enough to make a parser run more than just a few milliseconds.

Here's the list of the existing grammar benchmarks:

- MySQL: [readme](src/mysql/readme.md)
