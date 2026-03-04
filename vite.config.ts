import path from "node:path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import kiru from "vite-plugin-kiru"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import shiki, { type RehypeShikiOptions } from "@shikijs/rehype"
import {
  transformerNotationHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers"

import blogs from "./vite/plugin.blogs"

export default defineConfig({
  resolve: {
    alias: {
      $: path.resolve("src"),
    },
  },
  plugins: [
    tailwindcss(),
    blogs(),
    {
      enforce: "pre",
      ...mdx({
        jsx: false,
        jsxImportSource: "kiru",
        jsxRuntime: "automatic",
        remarkPlugins: [remarkFrontmatter],
        rehypePlugins: [
          [
            shiki,
            {
              theme: "nord",
              colorReplacements: {
                "#2e3440ff": "#1f1f23",
              },
              transformers: [
                transformerNotationHighlight(),
                transformerNotationDiff(),
              ],
            } satisfies RehypeShikiOptions,
          ],
        ],
        providerImportSource: "$/hooks/useMdxComponents",
      }),
    },
    kiru({
      loggingEnabled: true,
      ssg: {
        page: "page.{tsx,mdx}",
        transition: true,
        sitemap: {
          domain: "https://rausten.dev",
          changefreq: "weekly",
          overrides: {
            "/": {
              changefreq: "daily",
              priority: 1,
            },
            "/blog": {
              changefreq: "weekly",
              priority: 0.9,
            },
          },
        },
      },
    }),
  ],
  build: {
    emptyOutDir: true,
  },
})
