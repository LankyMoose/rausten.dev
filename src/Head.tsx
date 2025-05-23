import { createContext, useContext } from "kaioken"

export type HeadData = {
  title?: string
  meta?: Record<string, string>
}

export const HeadContext = createContext({
  head: {} as HeadData,
})

export function useHead(data: HeadData) {
  const context = useContext(HeadContext)
  if (data.title) {
    context.head.title = data.title
    if ("window" in globalThis) {
      document.title = data.title
    }
  }
  if (data.meta) {
    context.head.meta = {
      ...context.head.meta,
      ...data.meta,
    }
    if ("window" in globalThis) {
      const meta = document.querySelectorAll("meta[name]")
      for (const metaElement of meta) {
        const name = metaElement.getAttribute("name")
        if (!!name && name in data.meta) {
          metaElement.setAttribute("content", data.meta[name] ?? "")
        }
      }
    }
  }
}
