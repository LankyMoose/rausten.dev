import { Derive, useLayoutEffect, useSignal, useViewTransition } from "kiru"
import { loadRouteByPath } from "../routes"

export function ClientRouter({ path, Page, Layout }: RouteState) {
  const transition = useViewTransition()
  const routeState = useSignal<RouteState>({
    path,
    Page,
    Layout,
  })

  useLayoutEffect(() => {
    const handler = async () => {
      const path = window.location.pathname
      if (routeState.peek().path === path) return

      const { Page, Layout } = await loadRouteByPath(path)
      transition(() => {
        routeState.value = { path, Page, Layout }
      })
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  return (
    <Derive from={routeState}>
      {({ path, Layout, Page }) => <Layout path={path} Page={Page} />}
    </Derive>
  )
}
