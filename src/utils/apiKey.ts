import dotenv from "dotenv";
import fs from "fs";
import prompts from "prompts";
import chalk from "chalk";

dotenv.config();

const DEFAULT_API_KEY = "sk-or-v1-xxxx";
const MAX_FREE_TRIALS = 5;

function getTrials(): number {
  const trials = process.env.FREE_TRIALS;
  return trials ? parseInt(trials) : MAX_FREE_TRIALS;
}

function setTrials(count: number): void {
  if (!fs.existsSync(".env")) return;
  const envContent = fs.readFileSync(".env", "utf-8");
  const lines = envContent.split("\n");
  let found = false;
  
  const newLines = lines.map(line => {
    if (line.startsWith("FREE_TRIALS=")) {
      found = true;
      return `FREE_TRIALS=${count}`;
    }
    return line;
  });
  
  if (!found) {
    newLines.push(`FREE_TRIALS=${count}`);
  }
  
  fs.writeFileSync(".env", newLines.join("\n"));
  process.env.FREE_TRIALS = count.toString();
}

export function saveKey(key: string): void {
  const envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf-8") : "";
  const lines = envContent.split("\n");
  
  const newLines = lines.map(line => {
    if (line.startsWith("OPENROUTER_API_KEY=")) {
      return `OPENROUTER_API_KEY=${key}`;
    }
    return line;
  });
  
  if (!envContent.includes("OPENROUTER_API_KEY=")) {
    newLines.push(`OPENROUTER_API_KEY=${key}`);
  }
  
  fs.writeFileSync(".env", newLines.join("\n"));
  process.env.OPENROUTER_API_KEY = key;
}

function isUserKey(key: string | undefined): boolean {
  return key !== undefined && key !== DEFAULT_API_KEY;
}

export async function getApiKey(): Promise<string> {
  let savedKey = process.env.OPENROUTER_API_KEY;
  let trials = getTrials();
  
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
    
    if (savedKey && isUserKey(savedKey)) {
      console.log(chalk.gray(`  Using free trial\n`));
      return savedKey;
    }
    
    console.log(chalk.gray(`  Using free trial\n`));
    return DEFAULT_API_KEY;
  }
  
  let key = savedKey;
  
  if (savedKey && isUserKey(savedKey)) {
    const keepOrChange = await prompts({
      type: "select",
      name: "value",
      message: chalk.yellow("  API key saved. Use same or enter new?"),
      choices: [
        { title: chalk.green("Use Free key (only 5 commit)"), value: "keep" },
        { title: chalk.blue("Enter new key"), value: "change" },
      ],
    });

    if (keepOrChange.value === "keep") {
      console.log(chalk.green("  Using saved API key\n"));
      return key!;
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
  console.log(chalk.green("  Key saved to .env\n"));
  
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
