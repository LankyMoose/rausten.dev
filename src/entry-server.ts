import { renderToString } from "kaioken"
import { Wrapper } from "./Wrapper"
import { loadPageByPath } from "./utils"
import type { HeadData } from "./Head"

export async function render({ path }: { path: string }) {
  const Page = await loadPageByPath(path)
  const head = {
    title: "rausten.dev",
    meta: {
      description: "rausten.dev - The personal website of Rob Austen",
    },
  } satisfies HeadData

  const body = renderToString(Wrapper, { path, Page, head })
  const title = `<title>${head.title}</title>`
  const meta = Object.entries(head.meta)
    .map(([key, value]) => `<meta name="${key}" content="${value}">`)
    .join("\n")

  return {
    body,
    head: `${title}\n${meta}`,
  }
}
