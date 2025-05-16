import fs from "node:fs"
import { render } from "./dist/server/entry-server.js"

function pathToRoute(path) {
  return path
    .replace(/\.tsx$/, "")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "/")
    .replace(/\[(\w+)\]/g, ":$1")
}

const html = fs.readFileSync("./dist/client/index.html", "utf-8")
const routes = fs
  .readdirSync("./src/pages", {
    recursive: true,
  })
  .map((r) => "/" + r.replace(/\\/g, "/"))
  .map(pathToRoute)

console.log("SSG - routes", routes)

routes.forEach(async (route) => {
  // we need to transform 'blog\\index.tsx' into '/blog/index.tsx'
  if (route.split("/").length > 1) {
    // ensure child dir is created

    fs.mkdirSync("./dist/client/" + route.split("/").slice(0, -1).join("/"), {
      recursive: true,
    })
  }

  const rendered = html.replace(
    "<body></body>",
    `<body>${await render({ path: route })}</body>`
  )

  if (route.endsWith("/")) {
    route += "index"
  }
  fs.writeFileSync("./dist/client" + route + ".html", rendered)
})
