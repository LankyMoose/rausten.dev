import {
  defineConfig,
  Plugin,
  PluginOption,
  UserConfig,
  build as viteBuild,
} from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import { read } from "to-vfile"
import { matter } from "vfile-matter"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import fs from "node:fs/promises"

const blogDir = path.resolve("src/pages/blog")
const clientDist = path.resolve("dist/client")
const serverDist = path.resolve("dist/server")

const virtualManifestModuleId = "virtual:blog-manifest"
const resolvedVirtualManifestModuleId = "\0" + virtualManifestModuleId
const manifest: BlogManifest = {}

const sharedPlugins: PluginOption[] = [
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
  plugins: [...sharedPlugins, fullBuildAndSSG()],
  build: {
    outDir: clientDist,
    emptyOutDir: true,
  },
})

function blogDiscovery(): Plugin {
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

function fullBuildAndSSG(): Plugin {
  return {
    name: "full-build-ssg",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      ssrBuild: {
        console.log("[build] Starting server-side build...")
        await viteBuild({
          ...sharedConfig,
          configFile: false,
          build: {
            outDir: serverDist,
            ssr: "src/entry-server.ts",
            rollupOptions: {
              input: path.resolve("src/entry-server.ts"),
            },
          },
          plugins: sharedPlugins,
        })
      }

      ssg: {
        console.log("[SSG] Starting static site generation...")
        const routes = (await fs.readdir("src/pages", { recursive: true }))
          .filter((f) => f.endsWith(".tsx") || f.endsWith(".mdx"))
          .map((f) =>
            f
              .replace(/\\/g, "/")
              .replace(/\.tsx$/, "")
              .replace(/\.mdx$/, "")
              .replace(/^index$/, "")
              .replace(/\/index$/, "")
          )
          .map((r) => `/${r}`)
          .sort()

        console.log("[SSG] Found routes:", routes)

        generatePages: {
          console.log("[SSG] Generating pages...")
          const templateHtml = await fs.readFile(
            path.join(clientDist, "index.html"),
            "utf-8"
          )
          const rendererPath = path.join(serverDist, "entry-server.js")
          const { render } = await import(`file://${rendererPath}`)

          for (const route of routes) {
            const { body, head } = await render({ path: route })

            const rendered = templateHtml
              .replace("<!-- HEAD -->", head)
              .replace("<body></body>", `<body>${body}</body>`)

            const filePath = route.endsWith("/")
              ? path.join(clientDist, route, "index.html")
              : path.join(clientDist, route + ".html")

            await fs.mkdir(path.dirname(filePath), { recursive: true })
            await fs.writeFile(filePath, rendered)
            console.log("[SSG] Created page", filePath)
          }
        }

        sitemap: {
          console.log("[SSG] Generating sitemap...")
          const baseUrl = "https://rausten.dev"
          const exclude = ["/404"]
          const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => !exclude.includes(r))
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r === "/" ? "" : r}</loc>
  </url>\n`
  )
  .join("")}</urlset>`
          await fs.writeFile(path.join(clientDist, "sitemap.xml"), sitemapXml)
          console.log("[SSG] Sitemap generated")
        }
      }
    },
  }
}
