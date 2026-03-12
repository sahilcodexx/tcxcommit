"use client";

import { H1, H2, H3, P, Code, Pre, Ul, Ol, Li, A } from "@/components/docs/mdx-elements";

export default function InstallPage() {
  return (
    <>
      <H1>Installation</H1>

      <P>
        termyCommit can be installed globally via npm or used directly with npx. Choose whichever method works best for your workflow.
      </P>

      <H2>Prerequisites</H2>

      <Ul>
        <Li><A href="https://nodejs.org/">Node.js</A> (v18 or higher)</Li>
        <Li><A href="https://git-scm.com/">Git</A> (installed and configured)</Li>
        <Li>An OpenRouter API key (optional - 5 free trials included)</Li>
      </Ul>

      <H2>Quick Install</H2>

      <P>Install using npm:</P>

      <Pre>{`npm install -g termycommit`}</Pre>

      <P>Or use directly with npx (no installation needed):</P>

      <Pre>{`npx termycommit`}</Pre>

      <H2>Verify Installation</H2>

      <P>Check if termyCommit is installed:</P>

      <Pre>{`termycommit --version`}</Pre>

      <H2>Configuration</H2>

      <H3>API Key Setup</H3>

      <P>
        By default, termyCommit gives you 5 free trials. After that, you&apos;ll need your own OpenRouter API key:
      </P>

      <Ol>
        <Li>Visit <A href="https://openrouter.ai/">OpenRouter.ai</A></Li>
        <Li>Create an account and get your API key</Li>
        <Li>When prompted in termyCommit, enter your API key</Li>
        <Li>The key is saved to <Code>.env</Code> file automatically</Li>
      </Ol>

      <H3>Environment Variables</H3>

      <P>
        Your <Code>.env</Code> file will be created automatically with:
      </P>

      <Pre>{`OPENROUTER_API_KEY=your-api-key-here
FREE_TRIALS=5`}</Pre>

      <H2>Update</H2>

      <P>To update to the latest version:</P>

      <Pre>{`npm update -g termycommit`}</Pre>

      <H2>Uninstall</H2>

      <P>To remove termyCommit:</P>

      <Pre>{`npm uninstall -g termycommit`}</Pre>

      <H2>Next Steps</H2>

      <P>
        Now that you have termyCommit installed, check out the <A href="/docs/usage">Usage</A> guide to start generating commit messages!
      </P>
    </>
  );
}
