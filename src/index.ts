import { header } from "./ui/header.js";
import { printBox, spinner } from "./ui/spinner.js";
import { getApiKey, useTrial, saveKey } from "./utils/apiKey.js";
import { generateCommitMessage } from "./api/openrouter.js";
import { getGitDiff } from "./utils/git.js";
import chalk from "chalk";
import prompts from "prompts";

const VERSION = "1.0.0";

export async function run(): Promise<void> {
  try {
    header(VERSION);

    const start = await prompts({
      type: "confirm",
      name: "value",
      message: chalk.cyan("  Continue?"),
      initial: true,
    });

    if (!start.value) {
      return;
    }

    const apiKey = await getApiKey();

    try {
      const { execSync } = await import("child_process");
      execSync("git add .", { stdio: "ignore" });
    } catch {
      // Ignore if no changes to add
    }

    const diff = getGitDiff();
    if (!diff) {
      printBox(
        [chalk.red("No changes found"), chalk.gray("Make some changes first")],
        { borderColor: "red" }
      );
      return;
    }

    let message = "";
    let accepted = false;

    while (!accepted) {
      process.stdout.write("\n");
      const stopSpinner = spinner(chalk.cyan("Generating commit message..."));

      try {
        message = await generateCommitMessage(apiKey, diff);
      } catch (err) {
        stopSpinner();
        const error = err as Error;
        
        if (error.message.includes("rate_limit") || error.message.includes("Rate limit")) {
          printBox([
            chalk.red("Rate limit exceeded!"),
            chalk.yellow("Add your own API key for unlimited usage")
          ], {
            borderColor: "red",
            title: "Rate Limited"
          });
          
          const choice = await prompts({
            type: "select",
            name: "value",
            message: chalk.yellow("  Choose:"),
            choices: [
              { title: chalk.blue("Add my own API key"), value: "add" },
              { title: chalk.gray("Exit"), value: "exit" },
            ],
          });
          
          if (choice.value === "add") {
            const newKey = await prompts({
              type: "password",
              name: "apiKey",
              message: chalk.yellow("  Enter OpenRouter API key:"),
            });
            
            if (newKey.apiKey) {
              saveKey(newKey.apiKey);
              console.log(chalk.green("  Key saved! Run again."));
            }
          }
          return;
        }
        
        printBox([chalk.red(error.message)], {
          borderColor: "red",
          title: "API Error",
        });
        return;
      } finally {
        stopSpinner();
      }

      console.log();
      printBox([chalk.green(message)], { borderColor: "green" });

      const response = await prompts({
        type: "select",
        name: "action",
        message: chalk.yellow("\n  Choose:"),
        choices: [
          { title: chalk.green("Accept & Commit"), value: "commit" },
          { title: chalk.blue("Regenerate"), value: "regenerate" },
          { title: chalk.gray("Exit"), value: "exit" },
        ],
      });

      if (response.action === "commit") {
        try {
          const { execSync } = await import("child_process");
          execSync(`git commit -m "${message}"`, { stdio: "inherit" });
        } catch {
          printBox([chalk.red("Git commit failed")], { borderColor: "red" });
          return;
        }

        useTrial();
        printBox([chalk.green("Committed!")], { borderColor: "green" });

        const shouldPush = await prompts({
          type: "confirm",
          name: "value",
          message: chalk.yellow("\n  Push to remote?"),
          initial: true,
        });

        if (shouldPush.value) {
          try {
            const { execSync } = await import("child_process");
            execSync("git push", { stdio: "inherit" });
          } catch {
            printBox([chalk.red("Git push failed")], { borderColor: "red" });
            return;
          }
          printBox([chalk.green("Pushed!")], { borderColor: "green" });
        }

        accepted = true;
      } else if (response.action === "exit") {
        accepted = true;
      }
    }
  } catch (err) {
    const error = err as Error;
    if (error.message === "canceled") {
      return;
    }
    printBox([chalk.red(error.message)], {
      borderColor: "red",
      title: "Error",
    });
  }
}
