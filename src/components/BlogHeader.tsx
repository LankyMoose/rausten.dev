// @ts-ignore
import blogManifest from "virtual:blog-manifest"
type BlogHeaderProps = {
  children: JSX.Children
  route: string
}
export function BlogHeader({ children, route }: BlogHeaderProps) {
  const manifestEntry = blogManifest[route.slice(6)]
  return (
    <section className="flex flex-col min-h-[240px] sm:min-h-[320px] justify-end">
      <div id="hero">
        <div className="section-content flex flex-col gap-2">
          <h1 className="not-prose">
            <small className="text-sm text-spicy">
              {manifestEntry["created-at"]}
            </small>
            <big>{children}</big>
          </h1>
          <p className="text-muted" style="margin:0">
            {manifestEntry["description"]}
          </p>
        </div>
      </div>
    </section>
  )
}
