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
    SSG(),
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

function SSG() {
  return {
    name: "vite:ssg",
    apply: "build",
    enforce: "post",

    async closeBundle() {
      if (!this.environment.config.build.ssr) return

      console.log("[SSG] Starting static site generation...")

      const distDir = path.resolve("./dist/server")
      const rendererPath = path.join(distDir, "entry-server.js")
      const { render } = await import(`file://${rendererPath}`)

      const routes = (await fs.readdir("./src/pages", { recursive: true }))
        .filter(
          (filePath) => filePath.endsWith(".tsx") || filePath.endsWith(".mdx")
        )
        .map((filePath) => {
          let file = filePath
            .replace(/\\/g, "/")
            .replace(/\.tsx$/, "")
            .replace(/\.mdx$/, "")

          if (file === "index") {
            return "/"
          }
          if (file.endsWith("/index")) {
            file = file.slice(0, -"/index".length)
          }
          return "/" + file
        })
        .sort()

      pages: {
        let html
        try {
          html = await fs.readFile("./dist/client/index.html", "utf-8")
        } catch (error) {
          throw new Error(
            '[SSG] Failed to read "./dist/client/index.html". Ensure client build is complete.'
          )
        }
        for (const route of routes) {
          const pathParts = route.split("/").filter(Boolean)
          if (pathParts.length > 1) {
            const dir = pathParts.slice(0, -1).join("/")
            await fs.mkdir("./dist/client/" + dir, { recursive: true })
          }
          const { body, head } = await render({ path: route })
          const rendered = html
            .replace("<!-- HEAD -->", head)
            .replace("<body></body>", `<body>${body}</body>`)
          let outputPath = route
          if (route.endsWith("/")) {
            outputPath += "index"
          }
          outputPath = `./dist/client${outputPath}.html`
          await fs.writeFile(outputPath, rendered)
          console.log("[SSG] created page", outputPath)
        }
      }
      sitemap: {
        const excludedSitemapRoutes = ["/404"]
        const baseUrl = "https://rausten.dev"
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes
        .filter((route) => !excludedSitemapRoutes.includes(route))
        .map((route) => {
          const url = route === "/" ? baseUrl : `${baseUrl}${route}`
          return `  <url><loc>${url}</loc></url>`
        })
        .join("\n")}
      </urlset>\n`
        await fs.writeFile("./dist/client/sitemap.xml", sitemap)
        console.log("[SSG] Sitemap generated")
      }
    },
  } satisfies Plugin
}
