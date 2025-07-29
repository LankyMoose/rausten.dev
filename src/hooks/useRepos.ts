import { signal, useEffect, useViewTransition } from "kaioken"

type ReposState =
  | {
      loading: true
      error: null
      data: null
    }
  | {
      loading: false
      error: Error
      data: null
    }
  | {
      loading: false
      error: null
      data: Repository[]
    }

const reposState = signal<ReposState>(null!)

const loadRepos = async (
  minDuration = 500,
  expireDuration = 1000 * 60 * 60
): Promise<Repository[]> => {
  const fromStorage = localStorage.getItem("repos")
  if (fromStorage) {
    try {
      const parsed = JSON.parse(fromStorage)
      if (Date.now() - parsed.timestamp < expireDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration))
        return parsed.repos
      }
    } catch (error) {
      console.error(error)
      localStorage.removeItem("repos")
    }
  }

  const base = "https://api.github.com"
  const headers = {
    "X-GitHub-Api-Version": "2022-11-28",
  }
  const toShow = new Set([
    "kaioken",
    "async-idb-orm",
    "async-worker-ts",
    "matcha-js",
    "lit-match",
    "x-templ",
  ])

  const start = Date.now()
  const repos = await Promise.all(
    [
      fetch(`${base}/repos/CrimsonChi/kaioken`, { headers }),
      fetch(`${base}/users/LankyMoose/repos?type=owner`, { headers }),
    ].map((r) => r.then((res) => res.json()))
  ).then((r) => r.flat<Repository[]>().filter((repo) => toShow.has(repo.name)))

  const end = Date.now()
  localStorage.setItem("repos", JSON.stringify({ repos, timestamp: end }))

  const remainingDuration = minDuration - (end - start)
  if (remainingDuration > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingDuration))
  }

  return repos
}

const loadingState: ReposState = {
  loading: true,
  error: null,
  data: null,
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
            }
          })
        },
        (err) => {
          transition(() => {
            reposState.value = {
              loading: false,
              error: err,
              data: null,
            }
          })
        }
      )
    }
  }, [])

  return reposState.value ?? loadingState
}
