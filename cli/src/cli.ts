#!/usr/bin/env node
import { run } from "./index.js";

const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  console.log("1.0.7");
  process.exit(0);
}

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
tcxcommit - AI-powered git commit message generator

Usage: tcxcommit [options]

Options:
  --version, -v   Show version number
  --help, -h      Show help
`);
  process.exit(0);
}

run();
