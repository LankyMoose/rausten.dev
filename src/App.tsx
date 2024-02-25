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
        <PreviousWork />
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
          href="https://github.com/Robby6Strings"
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
          {/* <a href="#previous-work" className="button-link text-xl">
            Previous Work
          </a> */}
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

function PreviousWork() {
  return null
  return (
    <section id="previous-work">
      <h2 className="text-center text-3xl font-bold">
        <span className="inline-block">
          <span className="px-5 mb-2">Previous Work</span>
          <hr className="border border-white opacity-75" />
        </span>
      </h2>
      <PreviousWorkItem
        data={{
          title: "Karapoti Consulting",
          desc: "Planning, prototyping & implementing product expansions",
          imgSrc: "https://www.karapoti.com/uploads/logo.png",
          tags: [
            { text: "C#", color: "purple" },
            { text: ".NET", color: "cornflowerblue" },
            { text: "SQL", color: "red" },
            { text: "JS", color: "gold" },
          ],
        }}
      />
    </section>
  )
}

interface WorkItemData {
  title: string
  desc: string
  imgSrc: string
  tags: { text: string; color: string }[]
}

function PreviousWorkItem({ data }: { data: WorkItemData }) {
  return (
    <div className="item-card">
      <img src={data.imgSrc} />
      <h3>{data.title}</h3>
      <p>{data.desc}</p>
      <ul className="badge-list">
        {data.tags.map((t) => (
          <span
            className="badge text-xs px-1"
            style={{ backgroundColor: t.color }}
          >
            {t.text}
          </span>
        ))}
      </ul>
    </div>
  )
}
