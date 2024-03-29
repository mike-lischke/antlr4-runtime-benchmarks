# Benchmarking ANTLR4 With Different Runtimes And Grammars

This repository consists of various benchmarks that can be used to measure the performance of certain ANTLR4 runtimes in conjunction with a selected grammar. 

## Benchmarks Structure

The benchmarks are organized in folders (located in the `src` directory), whose names correspond to the grammar that is tested in that subtree, or a descriptive name for artificial grammars that deal with specific aspects of ANTLR4 lexers and grammars. Each of these folders contains subfolders for each target. This way we have independent subprojects, each of which can be built and run independently.

Currently there's only one set of benchmarks: MySQL parser benchmarks (using the official MySQL grammar from Oracle). The plan is to add more over time.

There's an own readme file for each grammar, explaining the installation details and listing the latest results. The general idea for all benchmarks is to do only the absolute minimum to measure the time a script or binary needs to parse specific input for a given grammar. No third party (test/benchmark) libraries or anything not directly related to building a runnable parser should be involved, to maintain a low entry point for everyone interested in running the benchmarks on their own boxes. 

It's not needed to measure times in micro seconds or even smaller time units, for a comparison. Instead the input should be complex enough to make a parser run more than just a few milliseconds.

Here's the list of the existing grammar benchmarks:

- MySQL: [readme](src/mysql/readme.md)


## Runtime Prequisites

Most runtimes must be built first, so that the benchmarks can use them. This section explains details for each of them.

### TypeScript

As a scripting language there's nothing you need to prepare. If you have Node.js installed you have everything you need for execution.

### C++

The C++ benchmark need a static library. You can either provide one yourself (e.g. from other projects) and copy that to the <root>/antlr4-cpp-runtime/lib folder. It must be named `antlr4-runtime` (plus the platform dependent extension like `.a` on Linux + macOS) so that the build scripts can find it for linking.

Or you can use a build script from this project, which I plan to add a bit later.
