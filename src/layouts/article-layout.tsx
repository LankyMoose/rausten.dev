import { className as cls } from "kiru/utils"
import type { MDXProps } from "mdx/types"
import { BlogHeader } from "$/components/BlogHeader"

export const ArticleLayout: LayoutComponent = ({ path, Page }) => {
  const MDXPage = Page as Kiru.FC<MDXProps>
  return (
    <MDXPage
      components={{
        wrapper: ({ children }) => (
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
        ),
        a: ({ href, children }: any) => (
          <a href={href} target={href.startsWith("http") ? "_blank" : "_self"}>
            {children}
          </a>
        ),
      }}
    />
  )
}
