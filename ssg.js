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

routes.forEach(async (path) => {
  if (path.split("/").length > 1) {
    // ensure child dir is created

    fs.mkdirSync("./dist/client/" + path.split("/").slice(0, -1).join("/"), {
      recursive: true,
    })
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
