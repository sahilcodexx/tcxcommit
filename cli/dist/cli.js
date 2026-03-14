#!/usr/bin/env node
import { run } from "./index.js";
const args = process.argv.slice(2);
if (args.includes("--version") || args.includes("-v")) {
    console.log("1.0.15");
    process.exit(0);
}
if (args.includes("--help") || args.includes("-h")) {
    console.log(`
  tcxcommit - AI-powered git commit message generator

Usage: tcxcommit [options]

Options:
  --version, -v   Show version number
  --help, -h      Show help
  --free-trial    Force the CLI to skip saved key and show the free-trial menu
`);
    process.exit(0);
}
const forceTrial = args.includes("--free-trial") || args.includes("--trial") || process.env.TCXCOMMIT_FORCE_TRIAL === "1";
run({ forceTrial });
