import { renderToString } from "kiru"
import { App } from "./app"
import { loadRouteByPath } from "./routes"

export async function render({ path }: { path: string }) {
  const routeComponents = await loadRouteByPath(path)
  const content = renderToString(
    <App initialState={{ path, ...routeComponents }} />
  )

  const [preHead, headContent, postHead] = content.split(/<head>|<\/head>/)

  return {
    body: `${preHead ?? ""}${postHead ?? ""}`,
    head: headContent ?? "",
  }
}
