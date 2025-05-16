import { Link } from "kaioken/router"
import { getRouteMap } from "../../routes"
import blogManifest from "virtual:blog-manifest"

export default function Page() {
  const routeMap = getRouteMap()
  return (
    <>
      <section className="p-4 flex-col min-h-[240px] sm:min-h-[320px] justify-end">
        <div id="hero">
          <div className="section-content flex flex-col gap-2">
            <h1>
              <small className="text-sm text-spicy"></small>
              <big>Blog</big>
            </h1>
            <p className="text-muted">
              Some random ramblings accompanied by code.
            </p>
          </div>
        </div>
      </section>
      <section className="p-4 mx-auto w-full flex flex-wrap gap-4 max-w-[calc(var(--content-width)+2rem)]">
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
  const { title, description, date } = manifestEntry
  return (
    <div
      className={[
        "flex flex-col gap-2 basis-[280px] grow p-4",
        "bg-white/2 border border-white/5 rounded-lg",
      ]}
    >
      <div className="flex gap-2 justify-between items-center">
        <Link to={route}>{title}</Link>
        <small className="text-neutral-400">
          {new Date(date).toDateString()}
        </small>
      </div>
      <p className="text-neutral-300">{description}</p>
    </div>
  )
}
