import { Plugin, build, UserConfig } from "vite"
import path from "node:path"
import fs from "node:fs/promises"

export default function SSG(
  _config: UserConfig & {
    clientDist: string
    serverDist: string
  }
): Plugin {
  const { clientDist, serverDist, ...config } = _config
  return {
    name: "full-build-ssg",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      ssrBuild: {
        console.log("[build] Starting server-side build...")
        await build({
          ...config,
          configFile: false,
          build: {
            outDir: serverDist,
            ssr: "src/entry-server.ts",
            rollupOptions: {
              input: path.resolve("src/entry-server.ts"),
            },
          },
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
              .replace("<!-- BODY -->", `<body>${body}</body>`)

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
