import { Hero } from "$/components/Hero"
import { Head, Link } from "kiru/router"

export default function Page() {
  return (
    <section className="flex flex-col p-4 min-h-[240px] sm:min-h-[320px] justify-end">
      <Head.Content>
        <title>404 - rausten.dev</title>
        <meta name="description" content="Page not found" />
      </Head.Content>
      <Hero
        sup="404"
        heading="Page not found"
        sub={
          <>
            Looks like you've wandered off the path. Let's go{" "}
            <Link to="/">home</Link>.
          </>
        }
      />
    </section>
  )
}
