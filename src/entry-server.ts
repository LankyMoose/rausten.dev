import { renderToString } from "kaioken"
import { App, loadPageByPath } from "./app"

export async function render({ path }: { path: string }) {
  const Page = await loadPageByPath(path)
  const content = renderToString(App, { path, Page })

  const [preHead, headContent, postHead] = content.split(/<head>|<\/head>/)

  return {
    body: preHead + postHead,
    head: headContent,
  }
}
