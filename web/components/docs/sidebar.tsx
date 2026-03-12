"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/install" },
      { title: "Usage", href: "/docs/usage" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pl-8 lg:block">
      <nav className="flex flex-col gap-4">
        {sidebarItems.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        isActive
                          ? "text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className={cn(
                        "relative",
                        isActive && "font-medium"
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
