import fs from "fs";
import os from "os";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";

const MAX_FREE_TRIALS = 5;
const TRIAL_KEY = "sk-or-v1-demo"; // Free demo key for trials
const CONFIG_DIR = path.join(os.homedir(), ".tcxcommit");
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
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { freeTrials: MAX_FREE_TRIALS };
  }
}

function saveConfig(config: Config): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function getTrials(): number {
  return loadConfig().freeTrials;
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

export async function getApiKey(): Promise<string> {
  const config = loadConfig();
  const trials = config.freeTrials;
  const savedKey = config.apiKey;
  
  // Check if user has their own custom key (different from trial key)
  const hasCustomKey = savedKey && savedKey !== TRIAL_KEY;
  
  // CASE 1: User has custom key saved - show Continue/Change
  if (hasCustomKey) {
    const choice = await prompts({
      type: "select",
      name: "value",
      message: chalk.yellow("  Choose:"),
      choices: [
        { title: chalk.green("Continue"), value: "continue" },
        { title: chalk.blue("Change API key"), value: "change" },
      ],
    });

    if (choice.value === "continue") {
      console.log(chalk.green(`  Using your API key\n`));
      return savedKey!;
    }
  }
  
  // CASE 2: No custom key but trials available - show Free trials / Add API key
  if (trials > 0) {
    const choice = await prompts({
      type: "select",
      name: "value",
      message: chalk.yellow("  Choose:"),
      choices: [
        { title: chalk.green(`Use free trials (${trials} left)`), value: "free" },
        { title: chalk.blue("Add your API key"), value: "add" },
      ],
    });

    if (choice.value === "free") {
      console.log(chalk.cyan(`  Using free trial\n`));
      return TRIAL_KEY;
    }
  } else {
    console.log(chalk.red("  Free trials exhausted! Add your API key."));
    console.log(chalk.cyan(`\n  Get key: https://openrouter.ai/keys\n`));
  }
  
  // User wants to add their own key
  console.log(chalk.cyan(`\n  Get your free API key:`));
  console.log(chalk.gray(`  https://openrouter.ai/keys\n`));
  
  const response = await prompts({
    type: "password",
    name: "apiKey",
    message: chalk.yellow("  Enter your OpenRouter API key:"),
  });

  const key = response.apiKey;

  if (!key) {
    console.log(chalk.red("  API key required"));
    process.exit(1);
  }

  saveKey(key);
  console.log(chalk.green("  Key saved!\n"));
  
  return key;
}

export function useTrial(): number {
  const trials = getTrials();
  if (trials > 0) {
    setTrials(trials - 1);
  }
  return trials;
}
