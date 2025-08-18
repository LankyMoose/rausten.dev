import blogManifest from "virtual:blog-manifest"
import { Hero } from "./Hero"
import { Head } from "./Head"
import { useRouter } from "$/app"

export function BlogHeader() {
  const { path } = useRouter()
  const { title, description, date } = blogManifest[path]
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
