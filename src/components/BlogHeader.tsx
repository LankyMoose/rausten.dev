import { getBlogManifestEntryFromRoute } from "../utils"

type BlogHeaderProps = {
  children: JSX.Children
  route: string
}
export function BlogHeader({ children, route }: BlogHeaderProps) {
  const { description, date } = getBlogManifestEntryFromRoute(route)
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
