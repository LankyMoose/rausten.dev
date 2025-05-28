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
        <img src="/icons/csharp.svg" />
        <img src="/icons/dotnet.svg" />
        <img src="/icons/sql.svg" />
        <img src="/icons/typescript.svg" />
        <img src="/icons/javascript.svg" />
        <img src="/icons/html.svg" />
        <img src="/icons/css.svg" />
      </section>
      <RepoList />
    </>
  )
}
