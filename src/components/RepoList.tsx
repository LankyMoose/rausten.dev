import Star from "./icons/star"
import Card from "./Card"
import type { AsyncTaskState } from "kiru"
import Github from "./icons/github"
import ExternalLink from "./icons/external-link"

interface RepoListProps {
  repos: AsyncTaskState<Repository[]>
}

export function RepoList({ repos }: RepoListProps) {
  return (
    <section className="relative w-full flex items-center justify-center min-h-[200px]">
      {repos.error ? (
        <i className="text-center text-sm px-4 py-2 border-red-300/50 border-2 bg-red-950/5 rounded-2xl max-w-[300px] mx-auto">
          {repos.error.message}
        </i>
      ) : (
        <ul className="flex flex-wrap gap-4 w-full">
          {repos.loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonItem key={i} idx={i} />
              ))
            : repos.data.map((repo, i) => (
                <RepoListItem key={repo.id} repo={repo} idx={i} />
              ))}
        </ul>
      )}
    </section>
  )
}

type RepoListItemProps = {
  repo: Repository
  idx: number
}

function RepoListItem({ repo, idx }: RepoListItemProps) {
  return (
    <Card.Root
      style={`view-transition-name:repo-${idx}`}
      className="md:basis-[calc(100%/2-1rem)]"
    >
      <Card.Header>
        <span className="flex gap-2 items-center">
          {repo.name}
          {repo.homepage && !repo.homepage.includes("npmjs.com") && (
            <a href={repo.homepage} target="_blank">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </span>
        <div className="flex gap-2 items-center">
          <a href={repo.html_url} target="_blank">
            <Github className="w-4 h-4" />
          </a>
          <span className="flex gap-1 items-center text-neutral-300!">
            <Star className="w-3 h-3" />
            <span className="text-xs">{repo.stargazers_count}</span>
          </span>
        </div>
      </Card.Header>
      <Card.Footer>{repo.description}</Card.Footer>
    </Card.Root>
  )
}

type SkeletonItemProps = {
  idx: number
}
function SkeletonItem({ idx }: SkeletonItemProps) {
  return (
    <Card.Root
      style={`view-transition-name:repo-${idx}`}
      className="md:basis-[calc(100%/2-1rem)]"
    >
      <Card.Header className="flex justify-between gap-4 py-1">
        <span className="w-1/2 h-5 bg-neutral-800/50 animate-pulse"></span>
        <span></span>
        <span className="w-14 h-5 bg-neutral-800/50 animate-pulse"></span>
      </Card.Header>
      <span className="w-full h-8 bg-neutral-800/50 animate-pulse"></span>
    </Card.Root>
  )
}
