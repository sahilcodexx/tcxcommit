import { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/sidebar";
import { TocProvider } from "@/components/docs/mdx-provider";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { DocsContent } from "@/components/docs/docs-content";

export const metadata: Metadata = {
  title: "Documentation - termyCommit",
  description: "Learn how to use termyCommit - AI-powered git commit message generator",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <TocProvider>
        <DocsContent>{children}</DocsContent>
      </TocProvider>
    </div>
  );
}
