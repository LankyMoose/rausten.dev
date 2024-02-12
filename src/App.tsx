import { GithubIcon } from "./components/icons/GithubIcon"
import { MenuIcon } from "./components/icons/MenuIcon"

export function App() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <HeroSection />
      </main>
      <footer></footer>
    </>
  )
}

function Nav() {
  return (
    <nav>
      <a
        href="https://github.com/Robby6Strings"
        target="_blank"
        className="rounded-full border-2 border-current p-1"
      >
        <GithubIcon />
      </a>
      <a href="/Rob-Austen-Resume.pdf" target="_blank" className="button-link">
        Resume
      </a>
      <button className="sm:hidden">
        <MenuIcon />
      </button>
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
