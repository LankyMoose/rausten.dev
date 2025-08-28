import {
  createContext,
  Derive,
  useContext,
  useLayoutEffect,
  useSignal,
  useViewTransition,
} from "kiru"
import { loadRouteByPath } from "../routes"

const RouterContext = createContext<RouteState>(null!)
export const useRouter = () => useContext(RouterContext)

interface AppProps {
  initialState: RouteState
}

export function App({ initialState }: AppProps) {
  const transition = useViewTransition()
  const routeState = useSignal(initialState)

  useLayoutEffect(() => {
    const handler = async () => {
      const newPath = window.location.pathname
      if (routeState.peek().path === newPath) return

      const { Page, Layout } = await loadRouteByPath(newPath)
      if (window.location.pathname !== newPath) return

      transition(() => {
        routeState.value = { path: newPath, Page, Layout }
      })
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  return (
    <Derive from={routeState}>
      {({ path, Layout, Page }) => (
        <RouterContext.Provider value={{ path, Layout, Page }}>
          <Layout>
            <Page />
          </Layout>
        </RouterContext.Provider>
      )}
    </Derive>
  )
}
