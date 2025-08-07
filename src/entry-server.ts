import { createElement, renderToString } from "kiru"
import { App } from "./app/App"
import { ClientRouter } from "./app/ClientRouter"
import { loadPageByPath } from "./app/routes"

export async function render({ path }: { path: string }) {
  const Page = await loadPageByPath(path)
  const content = renderToString(App, {
    children: createElement(ClientRouter, { path, Page }),
  })

  const [preHead, headContent, postHead] = content.split(/<head>|<\/head>/)

  return {
    body: preHead + postHead,
    head: headContent,
  }
}
