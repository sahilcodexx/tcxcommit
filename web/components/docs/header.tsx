"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github } from "lucide-react";

export function DocsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-medium italic text-neutral-900 dark:text-neutral-100"
          >
            termyCommit
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Link
              href="https://github.com/sahilcodexx/termyCommit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/docs"
              className="text-sm font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              Docs
            </Link>
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
