import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useViewTransition,
} from "kaioken"
import { loadPageByPath } from "./routes"
import { BlogHeader } from "$/components/BlogHeader"

type ClientRouterContextType = {
  path: string
  Page: () => JSX.Element
}
const ClientRouterContext = createContext<ClientRouterContextType>(null!)

type ClientRouterProps = {
  initialState: { path: string; Page: () => JSX.Element }
}
export function ClientRouter(props: ClientRouterProps) {
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
      <RouterOutlet />
    </ClientRouterContext.Provider>
  )
}

function RouterOutlet() {
  const { Page, path } = useContext(ClientRouterContext)
  // TODO: it would be great if we could abstract this into a more implicit 'layout' approach
  if (path.startsWith("/blog/")) {
    return (
      <Page
        // @ts-ignore
        components={{
          wrapper: ({ children }: any) => (
            <article
              className={[
                "prose-p:my-4 prose-p:font-light",
                "prose-headings:font-bold prose-headings:text-neutral-50",
                "prose prose-invert",
                "flex-col max-w-full",
              ]}
            >
              <BlogHeader route={path}></BlogHeader>
              {children}
            </article>
          ),
          a: ({ href, children }: any) => (
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : "_self"}
            >
              {children}
            </a>
          ),
        }}
      />
    )
  }
  return <Page />
}
