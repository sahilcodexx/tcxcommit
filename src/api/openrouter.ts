export async function generateCommitMessage(apiKey: string, diff: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com",
      "X-Title": "termycommit",
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

  const data = await res.json() as {
    choices?: Array<{ message: { content: string } }>;
    error?: { message: string };
  };

  if (!data.choices) {
    const errorMsg = data.error?.message || JSON.stringify(data);
    throw new Error(errorMsg);
  }

  return data.choices[0].message.content.trim();
}
