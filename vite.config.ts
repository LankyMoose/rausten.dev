import { defineConfig } from "vite"
import kiru from "vite-plugin-kiru"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
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
    mdx({
      jsx: false,
      jsxImportSource: "kiru",
      jsxRuntime: "automatic",
      remarkPlugins: [remarkFrontmatter],
      providerImportSource: "$/hooks/useMdxComponents",
    }),
    kiru({
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
