import { createElement, renderToString } from "kiru"
import { App } from "./app/App"
import { ClientRouter } from "./app/ClientRouter"
import { loadRouteByPath } from "./routes"

export async function render({ path }: { path: string }) {
  const { Page, Layout } = await loadRouteByPath(path)
  const content = renderToString(App, {
    children: createElement(ClientRouter, { path, Page, Layout }),
  })

  const [preHead, headContent, postHead] = content.split(/<head>|<\/head>/)

  return {
    body: preHead + postHead,
    head: headContent,
  }
}
