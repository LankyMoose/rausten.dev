import fs from "node:fs"
import { render } from "./dist/server/entry-server.js"

function pathToRoute(filePath) {
  let path = filePath
    .replace(/\\/g, "/")
    .replace(/\.tsx$/, "")
    .replace(/\.mdx$/, "")

  if (path === "index") {
    return "/"
  }

  if (path.endsWith("/index")) {
    path = path.slice(0, -"/index".length)
  }

  return "/" + path
}

const html = fs.readFileSync("./dist/client/index.html", "utf-8")
const routes = fs
  .readdirSync("./src/pages", { recursive: true })
  .map(pathToRoute)
  .filter((item, idx, arr) => arr.indexOf(item) === idx)
  .sort()

console.log("SSG - routes", routes)

routes.forEach(async (path) => {
  const pathParts = path.split("/").filter(Boolean)
  if (pathParts.length > 1) {
    // ensure child dir is created
    const dir = pathParts.slice(0, -1).join("/")
    console.log("SSG - creating dir")
    fs.mkdirSync("./dist/client/" + dir, { recursive: true })
  }
  const { body, head } = await render({ path })

  const rendered = html
    .replace("<!-- HEAD -->", head)
    .replace("<body></body>", `<body>${body}</body>`)

  if (path.endsWith("/")) {
    path += "index"
  }
  fs.writeFileSync("./dist/client" + path + ".html", rendered)
})

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

fs.writeFileSync("./dist/client/sitemap.xml", sitemap)
console.log("Sitemap generated:\n", sitemap)
