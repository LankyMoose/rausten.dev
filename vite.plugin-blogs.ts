import path from "node:path"
import fs from "node:fs/promises"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import type { HotUpdateOptions, Plugin } from "vite"

export default function blogDiscovery(): Plugin {
  const blogDir = path.resolve("src/pages/blog")
  const manifest: BlogManifest = {}
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId

  let server: import("vite").ViteDevServer | null = null
  let updateTimeout: ReturnType<typeof setTimeout>

  async function upsertFile(file: string) {
    const vFile = await read(path.join(blogDir, file))
    matter(vFile)
    manifest[file.split(".")[0]] = vFile.data.matter as BlogItemMeta
  }

  async function initArticles() {
    const files = await fs.readdir(blogDir)
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        await upsertFile(file)
      }
    }
  }

  async function updateArticle(options: HotUpdateOptions) {
    const { file: filePath, type } = options
    const fileName = filePath.split("/").pop()!

    if (type === "delete") {
      delete manifest[fileName.split(".")[0]]
    } else {
      return upsertFile(fileName)
    }
  }

  return {
    name: "blog-discovery",
    enforce: "post",
    configureServer(dev) {
      server = dev
    },
    async buildStart() {
      await initArticles()
    },
    async hotUpdate(options) {
      if (options.file.endsWith(".mdx")) {
        await updateArticle(options)

        clearTimeout(updateTimeout)
        updateTimeout = setTimeout(() => {
          const { moduleGraph, ws } = server!
          const mod = moduleGraph.getModuleById(resolvedVirtualManifestModuleId)
          if (mod) moduleGraph.invalidateModule(mod)
          ws.send({ type: "full-reload" })
        }, 250)
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
