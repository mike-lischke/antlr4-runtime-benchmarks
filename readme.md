# Benchmarking ANTLR4 With Different Runtimes And Grammars

This repository consists of various benchmarks that are used to measure the performance of certain ANTLR4 runtimes. Currently there's only one benchmark group: MySQL parser benchmarks (using the official MySQL grammar). In a later version I hope to add more groups with different characteristics than SQL code parsing.

Each benchmark group is located in an own sub folder of the `src` directory. Building and executing the benchmarks is managed by various scripts to make it as easy as possible for everyone to do their own comparsions.

Each benchmark group has an own readme file, explaining the installation details and the latest results.

Here's the list of benchmark groups:

- MySQL: [readme](src/MySQL/readme.md)
