import { createElement, lazy } from "kiru"
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
const layouts = import.meta.glob("./pages/**/layout.tsx") as {
  [fp: string]: () => Promise<DefaultComponentModule>
}

const ErrorPage = lazy(() => import("./pages/404/page"))
const EmptyLayout: Kiru.FC = ({ children }) => children

const routeCache = new Map<string, Promise<RouteComponents>>()

export function loadRouteByPath(path: string): Promise<RouteComponents> {
  if (!routeCache.has(path)) {
    routeCache.set(path, loadRouteByPath_impl(path))
  }
  return routeCache.get(path)!
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
          return [...acc, layouts[layoutPath]()]
        }
        return acc
      },
      []
    )

    const [Page, ...Layouts] = (
      await Promise.all([pages[fp](), ...layoutPromises])
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

  return { Page: ErrorPage, Layout: EmptyLayout }
}
