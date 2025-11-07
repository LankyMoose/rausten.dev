import blogManifest from "virtual:blog-manifest"
import { Hero } from "./Hero"
import { Head, useFileRouter } from "kiru/router"

export function BlogHeader() {
  const router = useFileRouter()
  const { title, description, date } = blogManifest[router.state.pathname]

  return (
    <>
      <Head.Content>
        <title>{`${title} - rausten.dev`}</title>
        <meta name="description" content={description} />
      </Head.Content>
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
