import { useAsync, Transition } from "kaioken"
import { Repository } from "../types"
import { GithubStar } from "./icons/GithubStar"
import { Loader } from "./Loader"

async function parseThrowErr(res: Response) {
  let msg: string | null = null
  try {
    const parsed = await res.json()
    if ("message" in parsed && typeof parsed.message === "string") {
      msg = parsed.message
      if (parsed.message.startsWith("API rate limit exceeded")) {
        msg = "API rate limit exceeded. Please try again later."
      }
      return
    }
    return parsed
  } catch (error) {
    throw new Error(res.ok ? "Failed to parse response" : res.statusText)
  } finally {
    if (msg) {
      throw new Error(msg)
    }
  }
}

export function RepoList() {
  const repos = useAsync<Repository[]>(async () => {
    // check localstorage for recent hit - if it's been less than 60 minutes, don't make another request
    const fromStorage = localStorage.getItem("repos")
    if (fromStorage) {
      try {
        const parsed = JSON.parse(fromStorage)
        if (Date.now() - parsed.timestamp < 1000 * 60 * 60) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          return parsed.repos
        }
      } catch (error) {
        console.error(error)
        localStorage.removeItem("repos")
      }
    }

    const start = Date.now()
    const repos = await Promise.all([
      await fetch("https://api.github.com/repos/CrimsonChi/kaioken").then(
        parseThrowErr
      ),
      await fetch("https://api.github.com/users/LankyMoose/repos")
        .then(parseThrowErr)
        .then((res) =>
          res.filter((repo: Repository) =>
            ["async-idb-orm", "async-worker-ts", "matcha-js"].includes(
              repo.name
            )
          )
        ),
    ]).then((res) => res.flat())
    const end = Date.now()
    localStorage.setItem("repos", JSON.stringify({ repos, timestamp: end }))

    const duration = end - start
    if (duration < 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 - duration))
    }

    return repos
  }, [])

  return (
    <section className="relative w-full flex items-center justify-center min-h-[200px] grow">
      <Transition
        in={repos.loading}
        initialState="entered"
        element={(state) => {
          const opacity = state === "entered" ? "1" : "0"
          const translateY = state === "entered" ? 0 : -100
          const scale = state === "entered" ? "1" : "0"
          return (
            <div
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
        initialState="exited"
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
              className="repos-list"
              style={{
                transform: `translateY(${translateY}%)`,
                opacity,
                transition:
                  "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
              }}
            >
              {repos.data &&
                repos.data.map((repo) => (
                  <li key={repo.id} className="repos-list__item">
                    <div className="repos-list__item__header">
                      <a href={repo.html_url} target="_blank">
                        {repo.name}
                      </a>
                      <a
                        className="repos-list__item__stars"
                        href={repo.html_url + "/stargazers"}
                        target="_blank"
                      >
                        <GithubStar fill="currentColor" />{" "}
                        {repo.stargazers_count}
                      </a>
                    </div>
                    <div className="repos-list__item__description">
                      {repo.description}
                    </div>
                  </li>
                ))}
            </ul>
          )
        }}
      />
    </section>
  )
}
