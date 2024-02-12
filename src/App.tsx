import { CsharpIcon } from "./components/icons/CsharpIcon"
import { CssIcon } from "./components/icons/CssIcon"
import { DotNetIcon } from "./components/icons/DotNetIcon"
import { GithubIcon } from "./components/icons/GithubIcon"
import { HtmlIcon } from "./components/icons/HtmlIcon"
import { JavascriptIcon } from "./components/icons/JavascriptIcon"
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
        <SkillsList />
      </main>
      <footer>
        <div className="flex justify-end">
          <span>
            Made with{" "}
            <a
              className="font-semibold"
              href="https://www.npmjs.com/package/kaioken"
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
    <nav>
      <a href="/Rob-Austen-Resume.pdf" target="_blank" className="button-link">
        Resume
      </a>
      <a
        href="https://github.com/Robby6Strings"
        target="_blank"
        className="rounded-full border-2 border-current p-1"
      >
        <GithubIcon />
      </a>
    </nav>
  )
}

function HeroSection() {
  return (
    <section id="hero">
      <div className="section-content">
        <h1 className="mb-8">
          <small className="text-sm text-spicy">Hi, my name is</small>
          <br />
          <big>Rob Austen.</big>
          <br />
          <big className="text-muted">I build things for the web.</big>
        </h1>
        <p className="text-muted">
          I'm a software developer focussed on building tools for interactive
          applications that replace or simplify existing technologies. My latest
          project is{" "}
          <a href="https://kaioban.com" target="_blank">
            Kaioban
          </a>
          .
        </p>
      </div>
    </section>
  )
}

function SkillsList() {
  return (
    <div id="skills-list">
      <CsharpIcon />
      <DotNetIcon />
      <SqlIcon />
      <TypescriptIcon />
      <JavascriptIcon />
      <HtmlIcon />
      <CssIcon />
    </div>
  )
}
