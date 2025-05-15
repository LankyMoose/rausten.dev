import { Link } from "kaioken/router"
import { useRouter } from "./components/ClientRouter"
import { GithubIcon } from "./components/icons/GithubIcon"
import { LinkedInIcon } from "./components/icons/LinkedInIcon"
import { LogoIcon } from "./components/icons/LogoIcon"

// @ts-ignore
import blogManifest from "virtual:blog-manifest"

export function App() {
  const { Page, path } = useRouter()
  console.log("APP", path)

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <PageContentDisplay Page={Page} key={path} route={path} />
      </main>
      <footer>
        <div className="flex justify-end">
          <span>
            Made with{" "}
            <a
              className="font-semibold"
              href="https://kaioken.dev"
              target="_blank"
            >
              Kaioken
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}

function PageContentDisplay({
  Page,
  route,
}: {
  Page: () => JSX.Element
  route: string
}) {
  if (Page.name === "MDXContent") {
    const manifestEntry = blogManifest[route.slice(6)]
    console.log("PageContentDisplay", manifestEntry)
    return (
      <section
        className={[
          "prose prose-invert prose-headings:font-bold prose-headings:text-neutral-50 max-w-full",
          "flex-col",
        ]}
      >
        <Page
          // @ts-ignore
          components={{
            h1: ({ children }: any) => (
              <div className="flex flex-col min-h-[240px] sm:min-h-[320px] justify-end">
                <div id="hero">
                  <div className="section-content flex flex-col gap-2">
                    <h1 className="not-prose">
                      <big>{children}</big>
                      <small className="text-sm text-spicy">
                        {manifestEntry["created-at"]}
                      </small>
                    </h1>
                  </div>
                </div>
              </div>
            ),
          }}
        />
      </section>
    )
  }
  return <Page />
}

function Nav() {
  return (
    <nav className="justify-between w-full">
      <div className="flex gap-4">
        <Link to="/" className="flex items-center">
          <LogoIcon />
        </Link>
        {/* <Link to="/blog" className="flex items-center underline">
          Blog
        </Link> */}
      </div>
      <div className="flex gap-4">
        <a
          href="/Rob-Austen-Resume.pdf"
          target="_blank"
          className="button-link"
        >
          Resume
        </a>
        <a
          href="https://github.com/LankyMoose"
          target="_blank"
          className="rounded-full border-2 border-current p-1"
        >
          <GithubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/rausten/"
          target="_blank"
          className="rounded-full border-2 border-current p-1"
        >
          <LinkedInIcon />
        </a>
      </div>
    </nav>
  )
}
