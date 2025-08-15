import { Plugin, build, UserConfig } from "vite"
import path from "node:path"
import fs from "node:fs/promises"
import { ANSI } from "./ansi"
import { formatFilePath } from "../src/routes.utils"

export default function SSG(
  _config: UserConfig & {
    clientDist: string
    serverDist: string
  }
): Plugin {
  const { clientDist, serverDist, ...config } = _config

  const log = (...args: unknown[]) => console.log(ANSI.cyan("[SSG]"), ...args)

  return {
    name: "full-build-ssg",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      ssrBuild: {
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
        const start = Date.now()
        log("🔨", "Reading routes...")
        const routesIterator = fs.glob("src/pages/**/page.{tsx,mdx}")
        const routes: string[] = []
        for await (const route of routesIterator) {
          routes.push(formatFilePath(route.replace(/\\/g, "/")))
        }

        log(ANSI.green(`   ${routes.length} routes found.`), routes)

        generatePages: {
          log("🔨", "Generating pages...")
          const templateHtml = await fs.readFile(
            path.join(clientDist, "index.html"),
            "utf-8"
          )
          const rendererPath = path.join(serverDist, "entry-server.js")
          const { render } = await import(`file://${rendererPath}`)

          let numRoutes = 0
          for (const route of routes) {
            console.log("route", { route })
            const { body, head } = await render({ path: route })

            const rendered = templateHtml
              .replace("<!-- HEAD -->", head)
              .replace("<!-- BODY -->", `<body>${body}</body>`)

            const filePath = path.join(
              clientDist,
              (route === "/" ? "index" : route) + ".html"
            )

            await fs.mkdir(path.dirname(filePath), { recursive: true })
            await fs.writeFile(filePath, rendered)
            log(ANSI.green(" +"), ANSI.black(filePath))
            numRoutes++
          }
          log(ANSI.green(`   ${numRoutes} pages generated.`))
        }

        sitemap: {
          log("🔨", "Generating sitemap...")
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
          log(ANSI.green("   Sitemap generated."))
        }

        log(ANSI.green(` ✓`), `Completed in ${Date.now() - start}ms`)
      }
    },
  }
}
