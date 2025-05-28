import blogManifest from "virtual:blog-manifest"
import { Link } from "$/components/Link"
import { Hero } from "$/components/Hero"
import { Head } from "$/components/Head"

export default function Page() {
  return (
    <>
      <Head>
        <title>Blog - rausten.dev</title>
        <meta
          name="description"
          content="The blog of the personal website of the person named Rob Austen"
        />
      </Head>
      <section>
        <Hero heading="Blog" sub="Some random ramblings accompanied by code." />
      </section>
      <section className="w-full flex flex-wrap gap-4">
        {Object.keys(blogManifest)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((path) => (
            <BlogListItemLink
              key={path}
              path={path}
              meta={blogManifest[path]}
            />
          ))}
      </section>
    </>
  )
}

type BlogListItemLinkProps = {
  path: string
  meta: BlogItemMeta
}

function BlogListItemLink({ path, meta }: BlogListItemLinkProps): JSX.Element {
  const { title, description, date } = meta
  return (
    <div className="card flex flex-col gap-2 grow p-4">
      <div className="flex gap-2 justify-between items-center">
        <Link to={`/blog/${path}`}>{title}</Link>
        <small className="text-neutral-400">
          {new Date(date).toDateString()}
        </small>
      </div>
      <p className="text-neutral-300 font-light">{description}</p>
    </div>
  )
}
