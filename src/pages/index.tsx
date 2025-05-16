import { Hero } from "../components/Hero"
import { CsharpIcon } from "../components/icons/CsharpIcon"
import { CssIcon } from "../components/icons/CssIcon"
import { DotNetIcon } from "../components/icons/DotNetIcon"
import { HtmlIcon } from "../components/icons/HtmlIcon"
import { JavascriptIcon } from "../components/icons/JavascriptIcon"
import { SqlIcon } from "../components/icons/SqlIcon"
import { TypescriptIcon } from "../components/icons/TypescriptIcon"
import { RepoList } from "../components/RepoList"
import { useHead } from "../Head"

export default function Page() {
  useHead({
    title: "rausten.dev",
    meta: {
      description: "The personal website of Rob Austen",
    },
  })
  return (
    <>
      <HeroSection />
      <SkillsList />
      <RepoList />
    </>
  )
}

function HeroSection() {
  return (
    <section className="flex flex-col p-4 min-h-[240px] sm:min-h-[320px] justify-end">
      <Hero
        small="Hi, my name is "
        big="Rob Austen."
        description="I'm a software developer focussed on building interactive
            applications & tools that make building web applications easier."
      />
    </section>
  )
}

function SkillsList() {
  return (
    <section className="p-4" id="skills-list">
      <CsharpIcon />
      <DotNetIcon />
      <SqlIcon />
      <TypescriptIcon />
      <JavascriptIcon />
      <HtmlIcon />
      <CssIcon />
    </section>
  )
}
