import { useAsync } from "kaioken"
import { Repository } from "../types"

export function useRepos() {
  return useAsync<Repository[]>(async () => {
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
      await fetch("https://api.github.com/repos/CrimsonChi/kaioken").then((r) =>
        r.json()
      ),
      await fetch("https://api.github.com/users/LankyMoose/repos")
        .then((r) => r.json())
        .then((res) =>
          res.filter((repo: Repository) =>
            [
              "async-idb-orm",
              "async-worker-ts",
              "matcha-js",
              "lit-match",
              "x-templ",
              "rausten.dev",
            ].includes(repo.name)
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
}
