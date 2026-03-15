"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { DocsSidebar, DocsSidebarMobile } from "@/components/docs/sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { DocsHeader } from "@/components/docs/header";
import { useToc } from "@/components/docs/mdx-provider";

export function DocsContent({ children }: { children: ReactNode }) {
  const { items } = useToc();
  
  return (
    <>
      <DocsHeader />
      <DocsSidebarMobile />
      <div className="pt-28 lg:pt-14">
        <DocsSidebar />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 max-w-3xl min-h-screen py-8 px-4 md:px-8 lg:ml-64 lg:pr-52 xl:pr-56"
        >
          {children}
        </motion.main>
        <TableOfContents items={items} />
      </div>
    </>
  );
}
