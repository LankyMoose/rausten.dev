import path from "node:path"
import fs from "node:fs/promises"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import type { HotUpdateOptions, Plugin } from "vite"
import { ANSI } from "./ansi"

declare module "vfile" {
  interface DataMap {
    // `file.data.name` is typed as `string`
    matter: BlogItemMeta
  }
}

export default function blogs(): Plugin {
  const blogDir = path.resolve("src/pages/blog")
  const manifest: BlogManifest = {}
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId

  const log = (...args: unknown[]) => console.log(ANSI.cyan("[blogs]"), ...args)

  let server: import("vite").ViteDevServer | null = null
  let updateTimeout: NodeJS.Timeout

  async function upsertBlog(file: string) {
    const vFile = await read(path.join(blogDir, file))
    matter(vFile)
    manifest[file.split(".")[0]] = vFile.data.matter!
  }

  async function handleHotUpdate(options: HotUpdateOptions) {
    const { file: filePath, type } = options
    const fileName = filePath.split("/").pop()!

    if (type === "delete") {
      delete manifest[fileName.split(".")[0]]
    } else {
      return upsertBlog(fileName)
    }
  }

  return {
    name: "blog-discovery",
    enforce: "post",
    configureServer(dev) {
      server = dev
    },
    resolveId(id) {
      if (id === virtualManifestModuleId) return resolvedVirtualManifestModuleId
    },
    load(id) {
      if (id === resolvedVirtualManifestModuleId) {
        return `export default ${JSON.stringify(manifest)}`
      }
    },
    async buildStart() {
      const start = Date.now()
      log("🔨", "Reading articles...")
      const files = (await fs.readdir(blogDir)).filter((f) =>
        f.endsWith(".mdx")
      )
      log(ANSI.green(`   ${files.length} articles found.`))

      log("🔨", "Generating manifest entries...")
      for (const file of files) {
        await upsertBlog(file)
        log(ANSI.green(" +"), ANSI.black(file))
      }
      log(ANSI.green(`   ${files.length} manifest entries generated.`))
      log(ANSI.green(` ✓`), `Completed in ${Date.now() - start}ms`)
    },
    async hotUpdate(options) {
      if (!options.file.endsWith(".mdx")) {
        return
      }
      await handleHotUpdate(options)

      clearTimeout(updateTimeout)
      updateTimeout = setTimeout(() => {
        const { moduleGraph, ws } = server!
        const mod = moduleGraph.getModuleById(resolvedVirtualManifestModuleId)
        if (mod) moduleGraph.invalidateModule(mod)
        ws.send({ type: "full-reload" })
      }, 250)
    },
  }
}
