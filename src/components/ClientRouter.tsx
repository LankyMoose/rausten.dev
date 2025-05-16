import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useViewTransition,
} from "kaioken"
import { loadPageByPath } from "../utils"

type ClientRouterContextType = {
  path: string
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
    <ClientRouterContext.Provider value={{ path: pathname, Page }}>
      {props.children}
    </ClientRouterContext.Provider>
  )
}
