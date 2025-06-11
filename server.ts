import fs from "node:fs/promises"
import express from "express"
import { ViteDevServer } from "vite"
import path from "node:path"

const __dirname = path.resolve()
const isProduction = process.env.NODE_ENV === "production"
const port = process.env.PORT || 5173
const pageCache = new Map<string, string>()

const app = express()

let vite: ViteDevServer
if (!isProduction) {
  const { createServer } = await import("vite")
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import("compression")).default
  const sirv = (await import("sirv")).default
  app.use(compression())
  app.use(sirv("./dist/client", { extensions: [] }))
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace("/", "")

    if (isProduction) {
      const contents = await fs.readFile(
        path.join(__dirname, "dist/client", (url || "index") + ".html"),
        "utf-8"
      )
      res.status(200).set({ "Content-Type": "text/html" }).send(contents)
      pageCache.set(url, contents)
      return
    }

    let template = await fs.readFile("./index.html", "utf-8")
    template = await vite.transformIndexHtml(url, template)

    const { render } = (await vite.ssrLoadModule(
      "/src/entry-server.ts"
    )) as typeof import("./src/entry-server")

    const { body, head } = await render({ path: req.originalUrl })
    res
      .status(200)
      .set({ "Content-Type": "text/html" })
      .send(
        template
          .replace("<!-- HEAD -->", head)
          .replace("<!-- BODY -->", `<body>${body}</body>`)
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
