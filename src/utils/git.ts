import { execSync } from "child_process";

export function getGitDiff(): string | null {
  try {
    const diff = execSync("git diff --cached", {
      maxBuffer: 1024 * 1024 * 10,
      encoding: "utf-8",
    });

    if (!diff || diff.trim() === "") {
      return null;
    }

    return diff.slice(0, 6000);
  } catch (err) {
    const error = err as Error;
    if (error.message.includes("not a git repository")) {
      throw new Error("Not a git repository");
    }
    return null;
  }
}
