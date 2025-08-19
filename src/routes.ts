import { createElement } from "kiru"
import { formatFilePath } from "./routes.utils"

type DefaultComponentModule = {
  default: Kiru.FC
}

type RouteComponents = {
  Page: Kiru.FC
  Layout: Kiru.FC
}

const pages = import.meta.glob("./pages/**/page.(ts|md)x") as {
  [fp: string]: () => Promise<DefaultComponentModule>
}
if (!("./pages/404/page.tsx" in pages)) {
  pages["./pages/404/page.tsx"] = async () => ({
    default: () => "Page not found",
  })
  if (import.meta.env.DEV) {
    console.warn(
      "404 page not found. Make sure you have a page at ./pages/404/page.tsx"
    )
  }
}

declare global {
  interface Map<K, V> {
    getOrSet(key: K, value: () => V): V
  }
}
Map.prototype.getOrSet = function <K, V>(key: K, value: () => V) {
  if (!this.has(key)) {
    this.set(key, value())
  }
  return this.get(key)!
}

const layouts = import.meta.glob("./pages/**/layout.tsx") as {
  [fp: string]: () => Promise<DefaultComponentModule>
}

const routePromiseCache = new Map<string, Promise<RouteComponents>>()
const modulePromiseCache = new Map<string, Promise<DefaultComponentModule>>()

export function loadRouteByPath(path: string): Promise<RouteComponents> {
  return routePromiseCache.getOrSet(path, () => loadRouteByPath_impl(path))
}

async function loadRouteByPath_impl(path: string): Promise<RouteComponents> {
  for (const fp in pages) {
    const routePath = formatFilePath(fp)
    if (routePath !== path) continue

    const parts = fp.split("/").slice(1, -1)
    const layoutPromises = parts.reduce<Promise<DefaultComponentModule>[]>(
      (acc, _, i) => {
        const layoutPath = [".", ...parts.slice(0, i + 1), "layout.tsx"].join(
          "/"
        )
        if (layouts[layoutPath]) {
          const layoutPromise = modulePromiseCache.getOrSet(
            layoutPath,
            layouts[layoutPath]
          )
          return [...acc, layoutPromise]
        }
        return acc
      },
      []
    )

    const pagePromise = modulePromiseCache.getOrSet(fp, pages[fp])
    const [Page, ...Layouts] = (
      await Promise.all([pagePromise, ...layoutPromises])
    )
      .filter((m) => typeof m.default === "function")
      .map((m) => m.default)

    return {
      Page,
      Layout: ({ children }) =>
        Layouts.reduceRight(
          (children, Layout) => createElement(Layout, { children }),
          children
        ),
    }
  }

  return loadRouteByPath_impl("/404")
}
