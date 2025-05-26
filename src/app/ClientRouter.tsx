import { Derive, useLayoutEffect, useSignal, useViewTransition } from "kaioken"
import { loadPageByPath } from "./routes"
import { BlogHeader } from "$/components/BlogHeader"
import { MDXProps } from "mdx/types"

type RouteState = {
  path: string
  Page: () => JSX.Element
}

type ClientRouterProps = {
  initialState: RouteState
}
export function ClientRouter(props: ClientRouterProps) {
  const transition = useViewTransition()
  const routeState = useSignal<RouteState>({
    path: props.initialState.path,
    Page: props.initialState.Page,
  })

  useLayoutEffect(() => {
    const handler = async () => {
      const nextPage = await loadPageByPath(window.location.pathname)
      transition(() => {
        routeState.value = {
          path: window.location.pathname,
          Page: nextPage,
        }
      })
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  return (
    <Derive from={routeState}>
      {({ Page, path }) => {
        if (path.substring(0, 6) !== "/blog/") {
          return <Page />
        }

        const MDXPage = Page as Kaioken.FC<MDXProps>
        return (
          <MDXPage
            components={{
              wrapper: ({ children }) => (
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
      }}
    </Derive>
  )
}
