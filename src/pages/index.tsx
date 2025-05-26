import { Head } from "$/components/Head"
import { Hero } from "$/components/Hero"
import { RepoList } from "$/components/RepoList"

export default function Page() {
  return (
    <>
      <Head>
        <title>rausten.dev</title>
        <meta name="description" content="The personal website of Rob Austen" />
      </Head>
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
        sup="Hi, my name is "
        heading="Rob Austen."
        sub="I'm a software developer focussed on building interactive
            applications & tools that make building web applications easier."
      />
    </section>
  )
}

function SkillsList() {
  return (
    <section className="p-4" id="skills-list">
      <img src="/icons/csharp.svg" />
      <img src="/icons/dotnet.svg" />
      <img src="/icons/sql.svg" />
      <img src="/icons/typescript.svg" />
      <img src="/icons/javascript.svg" />
      <img src="/icons/html.svg" />
      <img src="/icons/css.svg" />
    </section>
  )
}
