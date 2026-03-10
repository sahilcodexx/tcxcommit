#!/usr/bin/env node
import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import prompts from "prompts";

dotenv.config();

function spinner(msg) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const interval = setInterval(() => {
    process.stderr.write(`\r${frames[i++ % frames.length]} ${msg}`);
  }, 80);
  return () => {
    clearInterval(interval);
    process.stderr.write("\r" + " ".repeat(msg.length + 3) + "\r");
  };
}

const DEFAULT_API_KEY = "sk-or-v1-xxx"; // Replace with your key

async function getApiKey() {
  let key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    const useOwn = await prompts({
      type: "select",
      name: "value",
      message: "Use your own OpenRouter API key?",
      choices: [
        { label: "Yes, I'll enter mine", value: true },
        { label: "No, use default", value: false },
      ],
    });

    if (useOwn.value) {
      const response = await prompts({
        type: "password",
        name: "apiKey",
        message: "Enter your OpenRouter API key:",
      });

      key = response.apiKey;

      if (!key) {
        console.log("❌ API key is required. Exiting...");
        process.exit(1);
      }

      fs.appendFileSync(".env", `\nOPENROUTER_API_KEY=${key}\n`);
      console.log("✅ API key saved to .env");
      process.env.OPENROUTER_API_KEY = key;
    } else {
      key = DEFAULT_API_KEY;
    }
  }

  return key;
}

async function generateCommitMessage(apiKey, diff) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com",
      "X-Title": "termyCommit",
    },
    body: JSON.stringify({
      model: "arcee-ai/trinity-mini:free",
      messages: [
        {
          role: "system",
          content:
            "You generate short conventional git commit messages like: feat:, fix:, docs:, refactor:",
        },
        {
          role: "user",
          content: `Generate a commit message for this git diff:\n${diff}`,
        },
      ],
      temperature: 0.3,
    }),
  });

  const data = await res.json();

  if (!data.choices) {
    throw new Error(data.error?.message || JSON.stringify(data));
  }

  return data.choices[0].message.content.trim();
}

async function run() {
  try {
    const apiKey = await getApiKey();

    let diff = execSync("git diff", {
      maxBuffer: 1024 * 1024 * 10,
    }).toString();

    if (!diff) {
      console.log("❌ No changes found. Stage some files first with 'git add'");
      return;
    }

    diff = diff.slice(0, 6000);

    let message = "";
    let accepted = false;

    while (!accepted) {
      process.stdout.write("\n");
      const stopSpinner = spinner("Generating commit message...");

      try {
        message = await generateCommitMessage(apiKey, diff);
      } finally {
        stopSpinner();
      }

      console.log("\n✨ Suggested Commit Message:\n");
      console.log(`   ${message}\n`);

      const response = await prompts({
        type: "select",
        name: "action",
        message: "What to do?",
        choices: [
          { label: "Accept & Commit", value: "commit" },
          { label: "Regenerate", value: "regenerate" },
          { label: "Exit", value: "exit" },
        ],
      });

      if (response.action === "commit") {
        execSync("git add .", { stdio: "inherit" });
        execSync(`git commit -m "${message}"`, { stdio: "inherit" });
        console.log("✅ Committed!");

        const shouldPush = await prompts({
          type: "select",
          name: "value",
          message: "Push to remote?",
          choices: [
            { label: "Yes, push", value: true },
            { label: "No, exit", value: false },
          ],
        });

        if (shouldPush.value) {
          execSync("git push", { stdio: "inherit" });
          console.log("✅ Pushed!");
        }

        accepted = true;
      } else if (response.action === "exit") {
        accepted = true;
      }
    }
  } catch (err) {
    console.log("\n❌ Error:", err.message);
  }
}

run();
