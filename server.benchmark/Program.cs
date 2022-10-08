// See https://aka.ms/new-console-template for more information

using BenchmarkDotNet.Running;
using Benchmark;

var summary = BenchmarkRunner.Run<CardRenderBenchmark>();
