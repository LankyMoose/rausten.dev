import { renderToString } from "kaioken"
import { Wrapper } from "./Wrapper"
import { loadPageByPath } from "./utils"

export async function render({ path }: { path: string }) {
  const Page = await loadPageByPath(path)
  return renderToString(Wrapper, { path, Page })
}
