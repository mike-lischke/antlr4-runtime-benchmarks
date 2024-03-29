# Benchmarking ANTLR4 With Different Runtimes And Grammars

This repository consists of various benchmarks that can be used to measure the performance of certain ANTLR4 runtimes in conjunction with a selected grammar. 

## Benchmarks Structure

The benchmarks are organized in folders (located in the `src` directory), whose names correspond to the grammar that is tested in that subtree, or a descriptive name for artificial grammars that deal with specific aspects of ANTLR4 lexers and grammars. Each of these folders contains subfolders for each target. This way we have independent subprojects, each of which can be built and run independently.

Currently there's only one set of benchmarks: MySQL parser benchmarks (using the official MySQL grammar from Oracle). The plan is to add more over time.

There's an own readme file for each grammar, explaining the installation details and listing the latest results. The general idea for all benchmarks is to do only the absolute minimum to measure the time a script or binary needs to parse specific input for a given grammar. No third party (test/benchmark) libraries or anything not directly related to building a runnable parser should be involved, to maintain a low entry point for everyone interested in running the benchmarks on their own boxes. 

It's not needed to measure times in micro seconds or even smaller time units, for a comparison. Instead the input should be complex enough to make a parser run more than just a few milliseconds.

Here's the list of the existing grammar benchmarks:

- MySQL: [readme](src/mysql/readme.md)
