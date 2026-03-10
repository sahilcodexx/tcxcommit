#!/usr/bin/env node
import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import prompts from "prompts";

dotenv.config();

async function getApiKey() {
  let key = process.env.OPENROUTER_API_KEY;

  if (!key) {
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

    // save to .env
    fs.appendFileSync(".env", `\nOPENROUTER_API_KEY=${key}\n`);
    console.log("✅ API key saved to .env");
    process.env.OPENROUTER_API_KEY = key;
  }

  return key;
}

async function run() {
  try {
    const apiKey = await getApiKey();

    let diff = execSync("git diff --cached", {
      maxBuffer: 1024 * 1024 * 10,
    }).toString();

    if (!diff) {
      console.log("❌ No staged changes found");
      return;
    }

    diff = diff.slice(0, 6000);

    console.log("🤖 Generating commit message...\n");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://github.com",
        "X-Title": "termyCommit",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
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
      console.log("❌ API Error:", data);
      return;
    }

    const message = data.choices[0].message.content.trim();
    console.log("✨ Suggested Commit Message:\n");
    console.log(message);
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

run();