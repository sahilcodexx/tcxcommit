"use client";

import { H1, H2, P, Code, Pre, Ul, Li, A, Blockquote } from "@/components/docs/mdx-elements";

export default function IntroPage() {
  return (
    <>
      <H1>Introduction</H1>

      <P>
        <strong>termyCommit</strong> is an AI-powered CLI tool that generates smart git commit messages using OpenRouter&apos;s free AI models. Never write commit messages manually again!
      </P>

      <H2>Features</H2>

      <Ul>
        <Li><strong>AI-Powered</strong> - Generates intelligent commit messages using advanced AI</Li>
        <Li><strong>Conventional Commits</strong> - Follows standard commit message conventions (feat:, fix:, docs:, etc.)</Li>
        <Li><strong>Free to Start</strong> - 5 free trials without API key</Li>
        <Li><strong>Your Own Key</strong> - Use your own OpenRouter API key for unlimited usage</Li>
        <Li><strong>Auto Stage</strong> - Automatically stages all changes before generating commit</Li>
        <Li><strong>Push Support</strong> - Option to push to remote after commit</Li>
      </Ul>

      <H2>Why termyCommit?</H2>

      <P>
        Writing good commit messages is important but often overlooked. termyCommit helps you:
      </P>

      <Ul>
        <Li>Save time on writing commit messages</Li>
        <Li>Maintain consistent commit message style</Li>
        <Li>Follow conventional commit standards</Li>
        <Li>Focus on coding instead of documentation</Li>
      </Ul>

      <Blockquote>
        &quot;Great commit messages are the key to a clean project history and easy debugging.&quot;
      </Blockquote>

      <H2>Quick Example</H2>

      <P>Here&apos;s what termyCommit generates for you:</P>

      <Pre>{`feat: Add user authentication module
- Implement JWT-based login
- Add password hashing with bcrypt
- Create auth middleware`}</Pre>

      <H2>Next Steps</H2>

      <P>
        Ready to get started? Head over to the <A href="/docs/install">Installation</A> guide to set up termyCommit in your project.
      </P>
    </>
  );
}
