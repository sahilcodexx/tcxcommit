"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { DocsSidebar } from "@/components/docs/sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { DocsHeader } from "@/components/docs/header";
import { useToc } from "@/components/docs/mdx-provider";

export function DocsContent({ children }: { children: ReactNode }) {
  const { items } = useToc();
  
  return (
    <>
      <DocsHeader />
      <div className="pt-14">
        <DocsSidebar />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 max-w-3xl min-h-screen py-8 pr-8 ml-64"
        >
          {children}
        </motion.main>
        <TableOfContents items={items} />
      </div>
    </>
  );
}
