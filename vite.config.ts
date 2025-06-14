import { defineConfig, PluginOption, UserConfig } from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import blogDiscovery from "./vite.plugin-blogs"
import SSG from "./vite.plugin-ssg"

const clientDist = path.resolve("dist/client")
const serverDist = path.resolve("dist/server")

const plugins: PluginOption[] = [
  tailwindcss(),
  blogDiscovery(),
  kaioken(),
  mdx({
    jsx: false,
    jsxImportSource: "kaioken",
    jsxRuntime: "automatic",
    remarkPlugins: [remarkFrontmatter],
  }),
]

const sharedConfig: UserConfig = {
  resolve: {
    alias: {
      $: path.resolve("src"),
    },
  },
  optimizeDeps: {
    include: ["**/*.css"],
  },
}

export default defineConfig({
  ...sharedConfig,
  plugins: [
    ...plugins,
    SSG({
      ...sharedConfig,
      plugins,
      clientDist,
      serverDist,
    }),
  ],
  build: {
    outDir: clientDist,
    emptyOutDir: true,
  },
})
