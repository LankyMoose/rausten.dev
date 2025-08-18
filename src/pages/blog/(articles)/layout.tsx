import { className as cls } from "kiru/utils"
import { BlogHeader } from "$/components/BlogHeader"

export default function Layout({ children }: { children: JSX.Children }) {
  return (
    <article
      className={cls(
        "prose-p:my-4 prose-p:font-light",
        "prose-headings:font-bold prose-headings:text-neutral-50",
        "prose prose-invert",
        "max-w-full"
      )}
    >
      <BlogHeader />
      <section>{children}</section>
    </article>
  )
}
