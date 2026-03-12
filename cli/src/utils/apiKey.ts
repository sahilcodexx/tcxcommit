import dotenv from "dotenv";
import fs from "fs";
import os from "os";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";

const DEFAULT_API_KEY = "sk-or-v1-xxxx";
const MAX_FREE_TRIALS = 5;
const CONFIG_DIR = path.join(os.homedir(), ".termycommit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string;
  freeTrials: number;
}

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadConfig(): Config {
  ensureConfigDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig: Config = { freeTrials: MAX_FREE_TRIALS };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
}

function saveConfig(config: Config): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getTrials(): number {
  const config = loadConfig();
  return config.freeTrials;
}

function setTrials(count: number): void {
  const config = loadConfig();
  config.freeTrials = count;
  saveConfig(config);
}

export function saveKey(key: string): void {
  const config = loadConfig();
  config.apiKey = key;
  saveConfig(config);
}

function isUserKey(key: string | undefined): boolean {
  return key !== undefined && key !== DEFAULT_API_KEY;
}

export async function getApiKey(): Promise<string> {
  const config = loadConfig();
  let trials = config.freeTrials;
  
  console.log(chalk.gray(`  Free trials remaining: ${trials}\n`));
  
  const choice = await prompts({
    type: "select",
    name: "value",
    message: chalk.yellow("  Choose API option:"),
    choices: [
      { title: chalk.green("Use my own API key"), value: "own" },
      { title: chalk.blue(`Use free trials (${trials} left)`), value: "free" },
    ],
  });

  if (choice.value === "free") {
    if (trials <= 0) {
      console.log(chalk.red("  Free trials exhausted! Add your own API key."));
      process.exit(1);
    }
    
    console.log(chalk.gray(`  Using free trial\n`));
    return DEFAULT_API_KEY;
  }
  
  let key = config.apiKey;
  
  if (key && isUserKey(key)) {
    const keepOrChange = await prompts({
      type: "select",
      name: "value",
      message: chalk.yellow("  API key saved. Use same or enter new?"),
      choices: [
        { title: chalk.green("Keep current key"), value: "keep" },
        { title: chalk.blue("Enter new key"), value: "change" },
      ],
    });

    if (keepOrChange.value === "keep") {
      console.log(chalk.green("  Using saved API key\n"));
      return key;
    }
  }
  
  const response = await prompts({
    type: "password",
    name: "apiKey",
    message: chalk.yellow("  Enter your OpenRouter API key:"),
  });

  key = response.apiKey;

  if (!key) {
    console.log(chalk.red("  API key required"));
    process.exit(1);
  }

  saveKey(key);
  console.log(chalk.green("  Key saved!\n"));
  
  console.log(chalk.green("  Using your API key\n"));
  return key;
}

export function useTrial(): number {
  let trials = getTrials();
  if (trials > 0) {
    trials--;
    setTrials(trials);
  }
  return trials;
}
