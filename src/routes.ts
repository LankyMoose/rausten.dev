const pages = import.meta.glob("./pages/**/*")

export function parsePath(path: string) {
  const [pathname] = path.split("?")
  return { pathname }
}

export function matchRoute(
  routePattern: string,
  pathname: string
): Record<string, string> | null {
  const routeSegments = routePattern.split("/").filter(Boolean)
  const pathSegments = pathname.split("/").filter(Boolean)

  if (routeSegments.length !== pathSegments.length) return null

  const params: Record<string, string> = {}
  for (let i = 0; i < routeSegments.length; i++) {
    const r = routeSegments[i]
    const p = pathSegments[i]
    if (r.startsWith(":")) {
      params[r.slice(1)] = p
    } else if (r !== p) {
      return null
    }
  }

  return params
}

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
    const routePath = pathToRoute(path)
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
