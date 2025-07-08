import { Derive, useLayoutEffect, useSignal, useViewTransition } from "kaioken"
import { className as cls } from "kaioken/utils"
import { loadPageByPath } from "./routes"
import { BlogHeader } from "$/components/BlogHeader"
import { MDXProps } from "mdx/types"

export function ClientRouter({ path, Page }: RouteState) {
  const transition = useViewTransition()
  const routeState = useSignal({ path, Page })

  useLayoutEffect(() => {
    const handler = async () => {
      const nextPath = window.location.pathname
      if (routeState.peek().path === nextPath) return
      const nextPage = await loadPageByPath(nextPath)
      transition(() => {
        routeState.value = {
          path: nextPath,
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
                  className={cls(
                    "prose-p:my-4 prose-p:font-light",
                    "prose-headings:font-bold prose-headings:text-neutral-50",
                    "prose prose-invert",
                    "max-w-full"
                  )}
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
