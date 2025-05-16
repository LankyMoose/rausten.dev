import { defineConfig } from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import { blogDiscovery } from "./src/blogDiscovery"
export default defineConfig({
  optimizeDeps: {
    include: ["**/*.css"],
  },
  build: {
    outDir: "docs",
  },
  plugins: [
    blogDiscovery(),
    kaioken(),
    mdx({
      jsx: false,
      jsxImportSource: "kaioken",
      jsxRuntime: "automatic",
      remarkPlugins: [remarkFrontmatter],
    }),
  ],
})
