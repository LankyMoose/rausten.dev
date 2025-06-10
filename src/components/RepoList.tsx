import { Transition, useEffect, useRef } from "kaioken"
import { Loader } from "./Loader"
import { useRepos } from "$/hooks/useRepos"
import Star from "./icons/star"

export function RepoList() {
  const repos = useRepos()
  const loaderContainer = useRef<HTMLDivElement>(null)
  useEffect(function maintainLoaderTopOffset() {
    if (loaderContainer.current) {
      const computedTop = window.getComputedStyle(loaderContainer.current).top
      loaderContainer.current.style.top = `${parseInt(computedTop)}px`
    }
  }, [])

  return (
    <section className="relative w-full flex items-center justify-center min-h-[200px]">
      <Transition
        in={repos.loading}
        initialState={repos.loading ? "entered" : "exited"}
        element={(state) => {
          const opacity = state === "entered" ? "1" : "0"
          const translateY = state === "entered" ? 0 : -100
          const scale = state === "entered" ? "1" : "0"
          return (
            <div
              ref={loaderContainer}
              className="flex justify-center text-primary-500 items-center absolute left-[calc(50vw - 50%)] top-1/2"
              style={{
                opacity,
                transform: `translateY(${translateY}%)`,
                scale,
                transition: "0.5s ease-in-out",
              }}
            >
              <Loader />
            </div>
          )
        }}
      />
      <Transition
        in={!repos.loading}
        initialState={repos.loading ? "exited" : "entered"}
        duration={repos.loading ? 150 : 0}
        element={(state) => {
          const translateY = state === "entered" ? 0 : 10
          const opacity = state === "entered" ? "1" : "0"
          return repos.error ? (
            <i
              style={{
                transform: `translateY(${translateY}%)`,
                opacity,
                transition:
                  "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
              }}
              className="text-center text-sm px-4 py-2 border-red-300/50 border-2 bg-red-950/5 rounded-2xl max-w-[300px] mx-auto"
            >
              {repos.error.message}
            </i>
          ) : (
            <ul
              className="flex flex-wrap gap-4"
              style={{
                transform: `translateY(${translateY}%)`,
                opacity,
                transition:
                  "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
              }}
            >
              {repos.data?.map((repo) => (
                <RepoListItem key={repo.id} repo={repo} />
              ))}
            </ul>
          )
        }}
      />
    </section>
  )
}

function RepoListItem({ repo }: { repo: Repository }) {
  return (
    <li className="md:basis-[calc(100%/2-1rem)] lg:basis-[calc(100%/3-1rem)] w-full grow flex flex-col gap-4 card">
      <div className="flex justify-between gap-4">
        <a href={repo.html_url} target="_blank">
          {repo.name}
        </a>
        <a
          className="flex items-center gap-2 text-neutral-300!"
          href={repo.html_url + "/stargazers"}
          target="_blank"
        >
          <Star />
          {repo.stargazers_count}
        </a>
      </div>
      <small className="text-neutral-300">{repo.description}</small>
    </li>
  )
}
