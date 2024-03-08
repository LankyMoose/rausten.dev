import { CsharpIcon } from "./components/icons/CsharpIcon"
import { CssIcon } from "./components/icons/CssIcon"
import { DotNetIcon } from "./components/icons/DotNetIcon"
import { GithubIcon } from "./components/icons/GithubIcon"
import { HtmlIcon } from "./components/icons/HtmlIcon"
import { JavascriptIcon } from "./components/icons/JavascriptIcon"
import { LinkedInIcon } from "./components/icons/LinkedInIcon"
import { LogoIcon } from "./components/icons/LogoIcon"
import { SqlIcon } from "./components/icons/SqlIcon"
import { TypescriptIcon } from "./components/icons/TypescriptIcon"

export function App() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <HeroSection />
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
      <LogoIcon />
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

function HeroSection() {
  return (
    <section>
      <div id="hero">
        <div className="section-content">
          <h1 className="mb-8">
            <small className="text-sm text-spicy">Hi, my name is</small>
            <big>Rob Austen.</big>
          </h1>
          <p className="text-muted">
            I'm a software developer focussed on building interactive
            applications & tools that make building web applications easier.
          </p>
        </div>
      </div>
      <div id="skills-list">
        <CsharpIcon />
        <DotNetIcon />
        <SqlIcon />
        <TypescriptIcon />
        <JavascriptIcon />
        <HtmlIcon />
        <CssIcon />
      </div>
    </section>
  )
}
