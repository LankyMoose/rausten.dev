import { defineConfig, Plugin } from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import tailwindcss from "@tailwindcss/vite"

import path from "node:path"
import fs from "node:fs/promises"

export default defineConfig({
  resolve: {
    alias: {
      $: path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["**/*.css"],
  },
  build: {
    outDir: "docs",
  },
  plugins: [
    tailwindcss(),
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

function blogDiscovery() {
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId

  const manifest: BlogManifest = {}
  let server: import("vite").ViteDevServer | null = null

  async function scanArticles() {
    const files = await fs.readdir("./src/pages/blog")
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const vFile = await read(`./src/pages/blog/${file}`)
        matter(vFile)
        manifest[file.split(".")[0]] = vFile.data.matter as BlogItemMeta
      }
    }
  }

  return {
    // scans /pages/blog for mdx files, and creates a route for each of them
    name: "blog-discovery",
    enforce: "post",
    async hotUpdate({ file }) {
      if (file.endsWith("mdx")) {
        const { moduleGraph, ws } = server!
        await scanArticles()
        moduleGraph.invalidateModule(
          moduleGraph.getModuleById(resolvedVirtualManifestModuleId)!
        )
        ws.send({
          type: "full-reload",
        })
      }
    },
    configureServer(devServer) {
      server = devServer
    },
    resolveId(id) {
      if (id === virtualManifestModuleId) {
        return resolvedVirtualManifestModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualManifestModuleId) {
        return `export default ${JSON.stringify(manifest)}`
      }
    },
    async buildStart() {
      await scanArticles()
    },
  } satisfies Plugin
}
