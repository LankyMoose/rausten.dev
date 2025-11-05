import { Hero } from "$/components/Hero"
import Csharp from "$/components/icons/csharp"
import Css from "$/components/icons/css"
import Dotnet from "$/components/icons/dotnet"
import Html from "$/components/icons/html"
import Javascript from "$/components/icons/javascript"
import Sql from "$/components/icons/sql"
import Typescript from "$/components/icons/typescript"
import { RepoList } from "$/components/RepoList"
import { definePageConfig, Head, PageProps, RouterState } from "kiru/router"

export const config = definePageConfig({
  loader: {
    load: async ({ signal }: RouterState): Promise<Repository[]> => {
      const base = "https://api.github.com"
      const headers = {
        "X-GitHub-Api-Version": "2022-11-28",
      }
      const toShow = new Set([
        "kiru",
        "async-idb-orm",
        "async-worker-ts",
        "matcha-js",
        "lit-match",
        "x-templ",
      ])
      return Promise.all(
        [
          fetch(`${base}/repos/kirujs/kiru`, { headers, signal }),
          fetch(`${base}/users/LankyMoose/repos?type=owner`, {
            headers,
            signal,
          }),
        ].map((r) => r.then((res) => res.json()))
      ).then((r) =>
        r.flat<Repository[]>().filter((repo) => toShow.has(repo.name))
      )
    },
    mode: "client",
    cache: {
      type: "localStorage",
      ttl: 1000 * 60 * 60,
    },
  },
})

export default function Page(repos: PageProps<typeof config>) {
  return (
    <>
      <Head.Content>
        <title>rausten.dev</title>
        <meta name="description" content="The personal website of Rob Austen" />
      </Head.Content>
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
      <RepoList repos={repos} />
    </>
  )
}
