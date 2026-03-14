import fs from "fs";
import os from "os";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";

const MAX_FREE_TRIALS = 5;
const CONFIG_DIR = path.join(os.homedir(), ".tcxcommit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string;
  hasCustomKey: boolean;
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
    const defaultConfig: Config = { 
      hasCustomKey: false,
      freeTrials: MAX_FREE_TRIALS 
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { hasCustomKey: false, freeTrials: MAX_FREE_TRIALS };
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
  config.hasCustomKey = true;
  saveConfig(config);
}

export async function getApiKey(): Promise<string> {
  const config = loadConfig();
  const trials = config.freeTrials;
  const savedKey = config.apiKey;
  const hasCustomKey = config.hasCustomKey;
  
  console.log(chalk.gray(`  Free trials remaining: ${trials}\n`));
  
  if (hasCustomKey && savedKey) {
    const choice = await prompts({
      type: "select",
      name: "value",
      message: chalk.yellow("  Choose:"),
      choices: [
        { title: chalk.green(`Use saved key (${trials} trials left)`), value: "saved" },
        { title: chalk.blue("Enter new key"), value: "new" },
      ],
    });

    if (choice.value === "saved") {
      console.log(chalk.green(`  Using saved API key\n`));
      return savedKey;
    }
  }
  
  if (trials <= 0) {
    console.log(chalk.red("  Free trials exhausted! Add your own API key."));
    console.log(chalk.cyan(`\n  Get free key: https://openrouter.ai/keys\n`));
    process.exit(1);
  }
  
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
