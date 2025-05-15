import { defineConfig, Plugin } from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"
import fs from "node:fs/promises"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import remarkFrontmatter from "remark-frontmatter"

export default defineConfig({
  optimizeDeps: {
    include: ["**/*.css"],
  },
  build: {
    outDir: "docs",
  },
  plugins: [
    kaioken(),
    mdx({
      jsx: false,
      jsxImportSource: "kaioken",
      jsxRuntime: "automatic",
      remarkPlugins: [remarkFrontmatter],
    }),
    articleDiscovery(),
  ],
})

function articleDiscovery() {
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId

  const articles: Record<string, Record<string, any> | undefined> = {}
  let server: import("vite").ViteDevServer | null = null

  async function scanArticles() {
    const files = await fs.readdir("./src/pages/blog")
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const vFile = await read(`./src/pages/blog/${file}`)
        matter(vFile)
        articles[file] = vFile.data.matter as Record<string, any> | undefined
      }
    }
  }

  return {
    // scans /pages/blog for mdx files, and creates a route for each of them
    name: "article-discovery",
    configureServer(devServer) {
      server = devServer

      // Watch for changes in the blog directory
      devServer.watcher.add("./src/pages/blog")

      devServer.watcher.on("add", async (file) => {
        if (file.endsWith(".mdx")) {
          await scanArticles()
          const { moduleGraph } = server!
          moduleGraph.invalidateModule(
            moduleGraph.getModuleById(resolvedVirtualManifestModuleId)!
          )
          server?.ws.send({
            type: "full-reload",
          })
        }
      })

      devServer.watcher.on("unlink", async (file) => {
        if (file.endsWith(".mdx")) {
          delete articles[file]
          const { moduleGraph, ws } = server!
          moduleGraph.invalidateModule(
            moduleGraph.getModuleById(resolvedVirtualManifestModuleId)!
          )
          ws.send({
            type: "full-reload",
          })
        }
      })

      devServer.watcher.on("change", async (file) => {
        if (file.endsWith(".mdx")) {
          await scanArticles()
          const { moduleGraph, ws } = server!
          moduleGraph.invalidateModule(
            moduleGraph.getModuleById(resolvedVirtualManifestModuleId)!
          )
          ws.send({
            type: "full-reload",
          })
        }
      })
    },
    resolveId(id) {
      if (id === virtualManifestModuleId) {
        return resolvedVirtualManifestModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualManifestModuleId) {
        return `export default ${JSON.stringify(articles)}`
      }
    },
    async buildStart() {
      await scanArticles()
    },
  } satisfies Plugin
}
