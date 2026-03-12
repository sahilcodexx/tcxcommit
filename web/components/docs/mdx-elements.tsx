"use client";

import { useEffect, ReactNode } from "react";
import { useToc } from "./mdx-provider";

interface HeadingProps {
  children: ReactNode;
  id?: string;
}

function generateId(children: ReactNode): string {
  if (typeof children === "string") {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  return "";
}

export function H1({ children, id }: HeadingProps) {
  const { setItems } = useToc();
  const headingId = id || generateId(children);

  useEffect(() => {
    setItems((prev: { id: string; title: string; level: number }[]) => {
      if (prev.some(item => item.id === headingId)) return prev;
      return [...prev, { id: headingId, title: String(children), level: 1 }];
    });
  }, [headingId, children]);

  return (
    <h1
      id={headingId}
      className="scroll-mt-20 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-8 mb-4"
    >
      {children}
    </h1>
  );
}

export function H2({ children, id }: HeadingProps) {
  const { setItems } = useToc();
  const headingId = id || generateId(children);

  useEffect(() => {
    setItems((prev: { id: string; title: string; level: number }[]) => {
      if (prev.some(item => item.id === headingId)) return prev;
      return [...prev, { id: headingId, title: String(children), level: 2 }];
    });
  }, [headingId, children]);

  return (
    <h2
      id={headingId}
      className="scroll-mt-20 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-8 mb-4"
    >
      {children}
    </h2>
  );
}

export function H3({ children, id }: HeadingProps) {
  const { setItems } = useToc();
  const headingId = id || generateId(children);

  useEffect(() => {
    setItems((prev: { id: string; title: string; level: number }[]) => {
      if (prev.some(item => item.id === headingId)) return prev;
      return [...prev, { id: headingId, title: String(children), level: 3 }];
    });
  }, [headingId, children]);

  return (
    <h3
      id={headingId}
      className="scroll-mt-20 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-6 mb-3"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-4 text-neutral-600 dark:text-neutral-400">
      {children}
    </p>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="relative rounded bg-neutral-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="relative mb-4 mt-6 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 p-4 dark:bg-neutral-900">
      <code className="font-mono text-sm">{children}</code>
    </pre>
  );
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-neutral-600 dark:text-neutral-400">{children}</ul>;
}

export function Ol({ children }: { children: ReactNode }) {
  return <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-neutral-600 dark:text-neutral-400">{children}</ol>;
}

export function Li({ children }: { children: ReactNode }) {
  return <li className="text-neutral-600 dark:text-neutral-400">{children}</li>;
}

export function A({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
    >
      {children}
    </a>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 border-neutral-300 pl-6 italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
      {children}
    </blockquote>
  );
}
