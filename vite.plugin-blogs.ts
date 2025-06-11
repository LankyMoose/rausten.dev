import path from "node:path"
import fs from "node:fs/promises"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import type { Plugin } from "vite"

export default function blogDiscovery(): Plugin {
  const blogDir = path.resolve("src/pages/blog")
  const manifest: BlogManifest = {}
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId
  let server: import("vite").ViteDevServer | null = null

  async function scanArticles() {
    const files = await fs.readdir(blogDir)
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const vFile = await read(path.join(blogDir, file))
        matter(vFile)
        manifest[file.split(".")[0]] = vFile.data.matter as BlogItemMeta
      }
    }
  }

  return {
    name: "blog-discovery",
    enforce: "post",
    configureServer(dev) {
      server = dev
    },
    async buildStart() {
      await scanArticles()
    },
    async hotUpdate({ file }) {
      if (file.endsWith(".mdx")) {
        await scanArticles()
        const { moduleGraph, ws } = server!
        const mod = moduleGraph.getModuleById(resolvedVirtualManifestModuleId)
        if (mod) moduleGraph.invalidateModule(mod)
        ws.send({ type: "full-reload" })
      }
    },
    resolveId(id) {
      if (id === virtualManifestModuleId) return resolvedVirtualManifestModuleId
    },
    load(id) {
      if (id === resolvedVirtualManifestModuleId) {
        return `export default ${JSON.stringify(manifest)}`
      }
    },
  }
}
