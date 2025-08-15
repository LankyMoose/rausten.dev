import { createElement, lazy } from "kiru"
import blogManifest from "virtual:blog-manifest"
import { formatFilePath } from "./routes.utils"

const pages = import.meta.glob("./pages/**/page.(ts|md)x")
const layouts = import.meta.glob("./pages/**/layout.tsx")

type PageModule = {
  default: Kiru.FC
}
type LayoutModule = {
  default: LayoutComponent
}

type RouteMap = {
  [path: string]: {
    Page: () => Promise<PageModule>
    Layout: (() => Promise<LayoutModule>) | null
  }
}

// todo: impl layout inheritance
const routes = Object.keys(pages).reduce<RouteMap>((acc, path) => {
  let Layout: (() => Promise<LayoutModule>) | null = null

  const layoutPath = path.split("/").slice(0, -1).concat("layout.tsx").join("/")
  if (layoutPath in layouts) {
    Layout = layouts[layoutPath] as () => Promise<LayoutModule>
  }

  const routePath = formatFilePath(path)
  return {
    ...acc,
    [routePath]: {
      Page: pages[path] as () => Promise<PageModule>,
      Layout,
    },
  }
}, {})

const ErrorPage = lazy(() => import("./pages/404/page"))
const EmptyLayout: LayoutComponent = ({ Page }) => createElement(Page)

export async function loadRouteByPath(
  path: string
): Promise<Omit<RouteState, "path">> {
  for (const route in routes) {
    if (route === path || route === path + "/") {
      const entry = routes[route]
      const [Page, Layout] = await Promise.all([entry.Page(), entry.Layout?.()])

      return {
        Page: Page.default,
        Layout: Layout?.default ?? EmptyLayout,
      }
    }
  }

  return {
    Page: ErrorPage,
    Layout: EmptyLayout,
  }
}

export function getBlogManifestEntryFromRoute(route: string) {
  return blogManifest[route.slice(6)]
}
