import { Link } from "kaioken/router"
import { useRouter } from "./components/ClientRouter"
import { GithubIcon } from "./components/icons/GithubIcon"
import { LinkedInIcon } from "./components/icons/LinkedInIcon"
import { LogoIcon } from "./components/icons/LogoIcon"

export function App() {
  const { Page } = useRouter()
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Page />
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

function Nav() {
  return (
    <nav className="justify-between w-full">
      <div className="flex gap-2">
        <Link to="/" className="flex items-center">
          <LogoIcon />
        </Link>
        <Link to="/blog" className="flex items-center">
          Blog
        </Link>
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
