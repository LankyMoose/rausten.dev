import blogManifest from "virtual:blog-manifest"
import { getRouteMap, RouteMapValue } from "./routes"

export async function loadPageByPath(path: string): Promise<() => JSX.Element> {
  const moduleLoader = await getRouteEntryByPath(path)
  return (await moduleLoader()).default
}

export async function getRouteEntryByPath(path: string) {
  const routes = getRouteMap()
  let matchedRoute: RouteMapValue | null = null

  for (const route in routes) {
    if (route === path || route === path + "/") {
      matchedRoute = routes[route]
      break
    }
  }

  if (matchedRoute === null) {
    return (() => import("./pages/404.tsx")) satisfies RouteMapValue
  }
  return matchedRoute
}

export function getBlogManifestEntryFromRoute(route: string) {
  return blogManifest[route.slice(6)]
}
