"use client";

import { H1, H2, H3, P, Code, Pre, Ul, Ol, Li, A } from "@/components/docs/mdx-elements";

export default function UsagePage() {
  return (
    <>
      <H1>Usage</H1>

      <P>
        Using termyCommit is simple! Just run the command in your git repository and let AI generate your commit message.
      </P>

      <H2>Basic Usage</H2>

      <P>Run termyCommit in your project directory:</P>

      <Pre>{`termycommit`}</Pre>

      <H3>Step by Step Process</H3>

      <Ol>
        <Li><strong>Start</strong> - Run <Code>termycommit</Code> in your git repository</Li>
        <Li><strong>Confirm</strong> - Press Enter to continue (or Ctrl+C to exit)</Li>
        <Li><strong>API Choice</strong> - Choose between your own API key or free trials</Li>
        <Li><strong>Auto Stage</strong> - All changes are automatically staged</Li>
        <Li><strong>Generate</strong> - AI analyzes your diff and generates a commit message</Li>
        <Li><strong>Review</strong> - Review the generated message</Li>
        <Li><strong>Commit</strong> - Accept to commit, or regenerate for a new message</Li>
        <Li><strong>Push</strong> - Optionally push to remote</Li>
      </Ol>

      <H2>Example Output</H2>

      <P>Here&apos;s what a typical session looks like:</P>

      <Pre>{`Getting Started with termyCommit
  v1.0.0 — AI commit helper

  Continue? [Y/n] y

  Free trials remaining: 5

  Choose API option:
    1. Use my own API key
    2. Use free trials (5 left)

  > Use free trials

  Using free trial

  Generating commit message...

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   feat: Add user authentication module           │
  │   - Implement JWT-based login                    │
  │   - Add password hashing with bcrypt             │
  │   - Create auth middleware                       │
  │                                                  │
  └──────────────────────────────────────────────────┘

  Choose:
    1. Accept & Commit
    2. Regenerate
    3. Exit

  > Accept & Commit

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   Committed!                                      │
  │                                                  │
  └──────────────────────────────────────────────────┘

  Push to remote? [Y/n] y

  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │   Pushed!                                         │
  │                                                  │
  └──────────────────────────────────────────────────┘`}</Pre>

      <H2>Tips</H2>

      <Ul>
        <Li><strong>Stage specific files</strong> - Use <Code>git add &lt;files&gt;</Code> before running to only commit specific changes</Li>
        <Li><strong>Regenerate if needed</strong> - If you don&apos;t like the first suggestion, choose &quot;Regenerate&quot;</Li>
        <Li><strong>Add your API key</strong> - For unlimited usage, add your own OpenRouter key</Li>
      </Ul>

      <H2>Commands</H2>

      <H3>First Time Setup</H3>

      <Pre>{`termycommit
# Follow the prompts to:
# 1. Choose API method (free trials or your own key)
# 2. Enter API key if you choose "own"
# 3. Key is saved automatically`}</Pre>

      <H3>Using Your Own API Key</H3>

      <Pre>{`# When prompted, select "Use my own API key"
# Enter your OpenRouter API key
# The key is saved to .env for future use`}</Pre>

      <H2>Troubleshooting</H2>

      <H3>No changes found</H3>

      <P>Make sure you have staged changes before running:</P>

      <Pre>{`git add .
termycommit`}</Pre>

      <H3>Rate limit exceeded</H3>

      <P>Add your own API key for unlimited usage:</P>

      <Pre>{`# Run termycommit and choose "Add my own API key"`}</Pre>

      <H3>Not a git repository</H3>

      <P>Initialize a git repository first:</P>

      <Pre>{`git init
git add .
termycommit`}</Pre>

      <H2>Next Steps</H2>

      <P>
        That&apos;s it! You&apos;re ready to use termyCommit. Happy coding!
      </P>
    </>
  );
}
