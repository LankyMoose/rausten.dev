import fs from "node:fs/promises"
import express from "express"
import { ViteDevServer } from "vite"

// Constants
const isProduction = process.env.NODE_ENV === "production"
const port = process.env.PORT || 5173
const base = process.env.BASE || "/"

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : ""

// Create http server
const app = express()

let vite: ViteDevServer
if (!isProduction) {
  const { createServer } = await import("vite")
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import("compression")).default
  const sirv = (await import("sirv")).default
  app.use(compression())
  app.use(base, sirv("./dist/client", { extensions: [] }))
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "")

    let template: string
    let render: ({ path }: { path: string }) => Promise<{
      body: string
      head: string
    }>

    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8")
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render
    } else {
      template = templateHtml
      // @ts-expect-error heck you ts
      render = (await import("./dist/server/entry-server.js")).render
    }

    const { body, head } = await render({ path: req.originalUrl })
    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .send(
        template
          .replace("<!-- HEAD -->", head)
          .replace("<body></body>", `<body>${body}</body>`)
      )
  } catch (e) {
    const err = e as Error
    vite?.ssrFixStacktrace(err)
    console.log(err.stack)
    res.status(500).end(err.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
