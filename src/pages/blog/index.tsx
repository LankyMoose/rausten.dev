import blogManifest from "virtual:blog-manifest"
import { Link } from "$/components/Link"
import { Hero } from "$/components/Hero"
import { getRouteMap } from "$/app/routes"
import { useHead } from "$/hooks/useHead"

export default function Page() {
  useHead({
    title: "Blog - rausten.dev",
    meta: {
      description:
        "The blog of the personal website of the person named Rob Austen",
    },
  })
  const routeMap = getRouteMap()
  return (
    <>
      <section className="flex flex-col p-4 min-h-[240px] sm:min-h-[320px] justify-end">
        <Hero heading="Blog" sub="Some random ramblings accompanied by code." />
      </section>
      <section className="p-4 mx-auto w-full flex flex-wrap gap-4 max-w-[calc(var(--content-width)+2rem)]">
        {Object.keys(routeMap)
          .filter((route) => route.startsWith("/blog/") && route.length > 6)
          .sort((a, b) => {
            const aDate = new Date(blogManifest[a.slice(6)].date)
            const bDate = new Date(blogManifest[b.slice(6)].date)
            return bDate.getTime() - aDate.getTime()
          })
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
        "flex flex-col gap-2 grow p-4",
        "bg-white/2 border border-white/5 rounded-lg",
      ]}
    >
      <div className="flex gap-2 justify-between items-center">
        <Link to={route}>{title}</Link>
        <small className="text-neutral-400">
          {new Date(date).toDateString()}
        </small>
      </div>
      <p className="text-neutral-300 font-light">{description}</p>
    </div>
  )
}
