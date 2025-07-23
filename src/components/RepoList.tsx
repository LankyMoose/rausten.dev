import { useRepos } from "$/hooks/useRepos"
import Star from "./icons/star"

export function RepoList() {
  const repos = useRepos()

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

function ItemWrapper({
  children,
  idx,
}: {
  children: JSX.Children
  idx: number
}) {
  return (
    <li
      style={`view-transition-name:repo-${idx}`}
      className="md:basis-[calc(100%/2-1rem)] w-full grow flex flex-col gap-4 card"
    >
      {children}
    </li>
  )
}

type RepoListItemProps = {
  repo: Repository
  idx: number
}

function RepoListItem({ repo, idx }: RepoListItemProps) {
  return (
    <ItemWrapper idx={idx}>
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
    </ItemWrapper>
  )
}

type SkeletonItemProps = {
  idx: number
}
function SkeletonItem({ idx }: SkeletonItemProps) {
  return (
    <ItemWrapper idx={idx}>
      <div className="flex justify-between gap-4 py-1">
        <span className="w-full h-5 bg-neutral-800/50 animate-pulse"></span>
        <span className="w-14 h-5 bg-neutral-800/50 animate-pulse"></span>
      </div>
      <span className="w-full h-8 bg-neutral-800/50 animate-pulse"></span>
    </ItemWrapper>
  )
}
