import {
  createContext,
  useAppContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "kaioken"
import { loadPageByPath } from "../utils"

type ClientRouterContextType = {
  path: string
  segments: string[]
  navigate: (path: string) => void
  Page: () => JSX.Element
}
const ClientRouterContext = createContext<ClientRouterContextType>(null!)

export const useRouter = () => useContext(ClientRouterContext)

type ClientRouterProps = {
  initialState: { path: string; Page: () => JSX.Element }
  transition?: boolean
}
export const ClientRouter: Kaioken.FC<ClientRouterProps> = (props) => {
  const appCtx = useAppContext()
  const viewTransition = useRef<ViewTransition | null>(null)
  const [pathname, setPathname] = useState(props.initialState.path)
  const [Page, setPage] = useState(() => props.initialState.Page)

  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  )

  const navigate = (path: string) => history.pushState(null, "", path)

  useLayoutEffect(() => {
    const handler = async () => {
      const nextPage = await loadPageByPath(window.location.pathname)
      console.log("nextPage", nextPage)
      if (!document.startViewTransition || !props.transition) {
        setPage(() => nextPage)
        return setPathname(window.location.pathname)
      }

      viewTransition.current = document.startViewTransition(() => {
        setPage(() => nextPage)
        setPathname(window.location.pathname)
        appCtx.flushSync()
      })
      viewTransition.current.finished.then(() => {
        viewTransition.current = null
      })
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  return (
    <ClientRouterContext.Provider
      value={{ path: pathname, segments, navigate, Page }}
    >
      {props.children}
    </ClientRouterContext.Provider>
  )
}
