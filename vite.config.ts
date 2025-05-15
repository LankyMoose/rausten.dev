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
    articleDiscovery(),
    kaioken(),
    mdx({
      jsx: false,
      jsxImportSource: "kaioken",
      jsxRuntime: "automatic",
      remarkPlugins: [remarkFrontmatter],
    }),
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
        articles[file.split(".")[0]] = vFile.data.matter as
          | Record<string, any>
          | undefined
      }
    }
  }

  return {
    // scans /pages/blog for mdx files, and creates a route for each of them
    name: "article-discovery",
    enforce: "post",
    async hotUpdate({ file }) {
      if (file.endsWith("mdx")) {
        console.log("hot update", file)
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
        return `export default ${JSON.stringify(articles)}`
      }
    },
    async buildStart() {
      await scanArticles()
    },
  } satisfies Plugin
}
