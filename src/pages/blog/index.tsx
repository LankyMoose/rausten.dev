import { Link } from "kaioken/router"
import { getRouteMap } from "../../routes"
// @ts-ignore
import blogManifest from "virtual:blog-manifest"
export default function Page() {
  const routeMap = getRouteMap()
  console.log({ routeMap, blogManifest })
  return (
    <>
      <section className="flex-col min-h-[240px] sm:min-h-[320px] justify-end">
        <div id="hero">
          <div className="section-content flex flex-col gap-2">
            <h1>
              <big>Blog</big>
              <small className="text-sm text-spicy">/Shower thoughts</small>
            </h1>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap gap-4">
        {Object.keys(routeMap)
          .filter((route) => route.startsWith("/blog/") && route.length > 6)
          .map((route) => (
            <BlogListItemLink key={route} route={route} />
          ))}
      </section>
    </>
  )
}

function BlogListItemLink({ route }: { route: string }) {
  const manifestEntry = blogManifest[route.slice(6)]
  return (
    <div
      className={[
        "flex flex-col gap-2 basis-[280px] grow p-4",
        "bg-white/2 border border-white/5 rounded-lg",
      ]}
    >
      <Link to={route}>{manifestEntry?.title}</Link>
      {manifestEntry?.description && (
        <p className="text-neutral-300">{manifestEntry.description}</p>
      )}
    </div>
  )
}
