import { Link } from "kaioken/router"
import { Hero } from "../components/Hero"

export default function Page() {
  return (
    <section className="flex flex-col p-4 min-h-[240px] sm:min-h-[320px] justify-end">
      <Hero
        small="404"
        big="Page not found"
        description={
          <>
            Looks like you've wandered off the path. Let's go{" "}
            <Link to="/">home</Link>.
          </>
        }
      />
    </section>
  )
}
