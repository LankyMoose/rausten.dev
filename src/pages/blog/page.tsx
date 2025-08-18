import { Link } from "$/components/Link"
import { Hero } from "$/components/Hero"
import { Head } from "$/components/Head"
import Card from "$/components/Card"
import { blogLinkData } from "./page.data"

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
      <section>
        <ul className="w-full flex flex-wrap gap-4">
          {blogLinkData.map(({ path, title, description, date }) => (
            <Card.Root>
              <Card.Header>
                <Link to={path}>{title}</Link>
                <small className="text-neutral-400">
                  {new Date(date).toDateString()}
                </small>
              </Card.Header>
              <Card.Footer>{description}</Card.Footer>
            </Card.Root>
          ))}
        </ul>
      </section>
    </>
  )
}
