const FREE_MODELS = [
  "minimax/minimax-m2.5:free",
  "openrouter/free",
];

async function callOpenRouter(apiKey: string, diff: string, model: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com",
      "X-Title": "tcxcommit",
    },
    body: JSON.stringify({
      model,
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `HTTP ${res.status}`;
    throw new Error(errorMsg);
  }

  const data = await res.json() as {
    choices?: Array<{ message: { content: string } }>;
    error?: { message: string };
  };

  if (!data.choices) {
    const errorMsg = data.error?.message || "Failed to generate commit message";
    throw new Error(errorMsg);
  }

  return data.choices[0].message.content.trim();
}

export async function generateCommitMessage(apiKey: string, diff: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of FREE_MODELS) {
    try {
      return await callOpenRouter(apiKey, diff, model);
    } catch (err) {
      lastError = err as Error;
    }
  }

  const error = lastError as Error;
  if (error.message.includes("fetch") || error.message.includes("network")) {
    throw new Error("Network error. Please check your internet connection.");
  }
  throw error;
}
