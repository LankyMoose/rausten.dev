import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useViewTransition,
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
}
export const ClientRouter: Kaioken.FC<ClientRouterProps> = (props) => {
  const transition = useViewTransition()
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
      transition(() => {
        setPage(() => nextPage)
        setPathname(window.location.pathname)
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
