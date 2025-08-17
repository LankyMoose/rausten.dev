import type { UseMdxComponents } from "@mdx-js/mdx"
import { createElement, ElementProps, unwrap } from "kiru"

/**
 * This hook is used by MDX files to override the default components.
 */
export const useMDXComponents: UseMdxComponents = () => {
  return {
    a: Link,
  }
}

function Link({ href, children }: ElementProps<"a">) {
  return createElement(
    "a",
    { href, target: unwrap(href)!.startsWith("http") ? "_blank" : "_self" },
    children
  )
}
