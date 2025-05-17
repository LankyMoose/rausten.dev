import { getBlogManifestEntryFromRoute } from "../utils"
import { useHead } from "../Head"
import { Hero } from "./Hero"

type BlogHeaderProps = {
  route: string
}
export function BlogHeader({ route }: BlogHeaderProps) {
  const { title, description, date } = getBlogManifestEntryFromRoute(route)
  useHead({
    title: `${title} - rausten.dev`,
    meta: { description },
  })
  return (
    <section className="flex flex-col min-h-[240px] sm:min-h-[320px] justify-end not-prose mb-6">
      <Hero
        small={new Date(date).toDateString()}
        big={title}
        description={description}
      />
    </section>
  )
}
