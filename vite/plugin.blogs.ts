import path from "node:path"
import fs from "node:fs/promises"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import type { HotUpdateOptions, Plugin } from "vite"
import { ANSI } from "./ansi"
import { formatFilePath } from "../src/routes.utils"

declare module "vfile" {
  interface DataMap {
    // `file.data.name` is typed as `string`
    matter: BlogItemMeta
  }
}

export default function blogs(): Plugin {
  const manifest: BlogManifest = {}
  const virtualManifestModuleId = "virtual:blog-manifest"
  const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId

  const log = (...args: unknown[]) => console.log(ANSI.cyan("[blogs]"), ...args)
  const normalizedCwd = process.cwd().replace(/\\/g, "/")

  let server: import("vite").ViteDevServer | null = null
  let updateTimeout: NodeJS.Timeout

  async function upsertBlog(file: string) {
    const vFile = await read(path.join(process.cwd(), file))
    matter(vFile)
    const formatted = formatFilePath(file.replace(/\\/g, "/"))
    manifest[formatted] = vFile.data.matter!
  }

  async function handleHotUpdate(options: HotUpdateOptions) {
    const { file: filePath, type } = options
    const normalized = filePath
      .replace(/\\/g, "/")
      .replace(normalizedCwd, "")
      .split("/")
      .join("/")
      .substring(1)

    if (type === "delete") {
      const formatted = formatFilePath(normalized)
      delete manifest[formatted]
    } else {
      return upsertBlog(normalized)
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

      const files = fs.glob("src/pages/blog/**/*.mdx")

      log("🔨", "Generating manifest entries...")
      let numEntries = 0
      for await (const file of files) {
        console.log("file", file)
        await upsertBlog(file)
        log(ANSI.green(" +"), ANSI.black(file))
        numEntries++
      }
      log(ANSI.green(`   ${numEntries} manifest entries generated.`), manifest)
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
        if (mod) moduleGraph.invalidateModule(mod, undefined, undefined, true)
        ws.send({ type: "full-reload" })
      }, 250)
    },
  }
}
