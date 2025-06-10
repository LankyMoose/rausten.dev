import { Head } from "$/components/Head"
import { Hero } from "$/components/Hero"
import Csharp from "$/components/icons/csharp"
import Css from "$/components/icons/css"
import Dotnet from "$/components/icons/dotnet"
import Html from "$/components/icons/html"
import Javascript from "$/components/icons/javascript"
import Sql from "$/components/icons/sql"
import Typescript from "$/components/icons/typescript"
import { RepoList } from "$/components/RepoList"

export default function Page() {
  return (
    <>
      <Head>
        <title>rausten.dev</title>
        <meta name="description" content="The personal website of Rob Austen" />
      </Head>
      <section>
        <Hero
          sup="Hi, my name is "
          heading="Rob Austen."
          sub="I'm a software developer focussed on building interactive
            applications & tools that make building web applications easier."
        />
      </section>
      <section
        id="skills"
        className="grid grid-flow-col items-center justify-center gap-4 mb-10"
      >
        <Csharp title="C#" />
        <Dotnet title=".NET" />
        <Sql title="SQL" />
        <Typescript title="TypeScript" />
        <Javascript title="JavaScript" />
        <Html title="HTML" />
        <Css title="CSS" />
      </section>
      <RepoList />
    </>
  )
}
