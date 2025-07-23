import { signal, UseAsyncState, useEffect, useViewTransition } from "kaioken"

type ReposState = UseAsyncState<Repository[]>
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

const invalidate = Object.freeze(() => {})
const loadingState: ReposState = {
  loading: true,
  error: null,
  data: null,
  invalidate,
}

export function useRepos(): ReposState {
  const transition = useViewTransition()
  useEffect(() => {
    if (reposState.value === null) {
      reposState.sneak(loadingState)
      loadRepos().then(
        (repos) => {
          transition(() => {
            reposState.value = {
              loading: false,
              error: null,
              data: repos,
              invalidate,
            }
          })
        },
        (err) => {
          transition(() => {
            reposState.value = {
              loading: false,
              error: err,
              data: null,
              invalidate,
            }
          })
        }
      )
    }
  }, [])

  return reposState.value ?? loadingState
}
