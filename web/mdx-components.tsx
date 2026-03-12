import type { MDXComponents } from "mdx/types";
import { H1, H2, H3, P, Code, Pre, Ul, Ol, Li, A, Blockquote } from "@/components/docs/mdx-elements";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    code: Code,
    pre: Pre,
    ul: Ul,
    ol: Ol,
    li: Li,
    a: A,
    blockquote: Blockquote,
    ...components,
  };
}
