import { getBlogManifestEntryFromRoute } from "../utils"
import { useHead } from "../Head"

type BlogHeaderProps = {
  children: JSX.Children
  route: string
}
export function BlogHeader({ children, route }: BlogHeaderProps) {
  const { title, description, date } = getBlogManifestEntryFromRoute(route)
  useHead({
    title: `${title} - rausten.dev`,
    meta: { description },
  })
  return (
    <section className="flex flex-col min-h-[240px] sm:min-h-[320px] justify-end">
      <div id="hero">
        <div className="section-content flex flex-col gap-2">
          <h1 className="not-prose">
            <small className="text-sm text-spicy">
              {new Date(date).toDateString()}
            </small>
            <big>{children}</big>
          </h1>
          <p className="text-muted" style="margin:0">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
