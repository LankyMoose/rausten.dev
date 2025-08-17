import { className as cls } from "kiru/utils"
import { BlogHeader } from "$/components/BlogHeader"
import { useRouter } from "$/app"

export default function Layout({ children }: { children: JSX.Children }) {
  const { path } = useRouter()
  if (path === "/blog") return children

  return (
    <article
      className={cls(
        "prose-p:my-4 prose-p:font-light",
        "prose-headings:font-bold prose-headings:text-neutral-50",
        "prose prose-invert",
        "max-w-full"
      )}
    >
      <BlogHeader route={path} />
      <section>{children}</section>
    </article>
  )
}
