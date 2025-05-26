import { signal, UseAsyncState, useEffect } from "kaioken"

type ReposState = Omit<UseAsyncState<Repository[]>, "invalidate">
const reposState = signal<ReposState>(null!)

const loadRepos = async (): Promise<Repository[]> => {
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
    fetch("https://api.github.com/repos/CrimsonChi/kaioken").then((r) =>
      r.json()
    ),
    fetch("https://api.github.com/users/LankyMoose/repos")
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
}

export function useRepos() {
  useEffect(() => {
    if (reposState.value === null) {
      reposState.sneak({
        loading: true,
        error: null,
        data: null,
      })
      loadRepos().then(
        (repos) => {
          reposState.value = {
            loading: false,
            error: null,
            data: repos,
          }
        },
        (err) => {
          reposState.value = {
            loading: false,
            error: err,
            data: null,
          }
        }
      )
    }
  }, [])

  return reposState.value ?? { loading: true, error: null, data: null }
}
