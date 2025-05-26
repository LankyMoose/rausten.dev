import blogManifest from "virtual:blog-manifest"

const pages = import.meta.glob("../pages/**/*")

export type PageModule = {
  default: () => JSX.Element
}
export type RouteMapValue = () => Promise<PageModule>
export type RouteMap = {
  [path: string]: RouteMapValue
}

export function getRouteMap(): RouteMap {
  const routes: RouteMap = {}

  for (const path in pages) {
    const routePath = pathToRoute(path.substring(1)) // turn leading "../" into "./"
    routes[routePath] = pages[path] as RouteMapValue
  }

  return routes
}

function pathToRoute(path: string): string {
  return path
    .replace("./pages", "")
    .replace(/\.tsx$/, "")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "/")
    .replace(/\[(\w+)\]/g, ":$1")
}

export async function loadPageByPath(path: string): Promise<() => JSX.Element> {
  const moduleLoader = await getRouteEntryByPath(path)
  return (await moduleLoader()).default
}

async function getRouteEntryByPath(path: string) {
  const routes = getRouteMap()
  let matchedRoute: RouteMapValue | null = null

  for (const route in routes) {
    if (route === path || route === path + "/") {
      matchedRoute = routes[route]
      break
    }
  }

  if (matchedRoute === null) {
    return (() => import("../pages/404.tsx")) satisfies RouteMapValue
  }
  return matchedRoute
}

export function getBlogManifestEntryFromRoute(route: string) {
  return blogManifest[route.slice(6)]
}
