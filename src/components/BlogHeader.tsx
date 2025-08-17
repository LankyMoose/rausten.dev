import blogManifest from "virtual:blog-manifest"
import { Hero } from "./Hero"
import { Head } from "./Head"

type BlogHeaderProps = {
  route: string
}
export function BlogHeader({ route }: BlogHeaderProps) {
  const { title, description, date } = getBlogManifestEntryFromRoute(route)
  return (
    <>
      <Head>
        <title>{`${title} - rausten.dev`}</title>
        <meta name="description" content={description} />
      </Head>
      <section className="not-prose mb-6">
        <Hero
          sup={new Date(date).toDateString()}
          heading={title}
          sub={description}
        />
      </section>
    </>
  )
}

export function getBlogManifestEntryFromRoute(route: string) {
  return blogManifest[route.slice(6)]
}
