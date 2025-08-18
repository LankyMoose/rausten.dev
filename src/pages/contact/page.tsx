import Card from "$/components/Card"
import { Head } from "$/components/Head"
import { Hero } from "$/components/Hero"
import { lazy } from "kiru"

const ContactForm = lazy(() => import("$/components/ContactForm"))

export default function Page() {
  return (
    <>
      <Head>
        <title>Contact - rausten.dev</title>
        <meta
          name="description"
          content="Reach out to me if you have any questions, comments, or just want to say hi."
        />
      </Head>
      <section>
        <Hero
          heading="Contact"
          sub="Reach out to me if you have any questions, comments, or just want to say hi."
        />
      </section>
      <section>
        <Card.Root>
          <ContactForm />
        </Card.Root>
      </section>
    </>
  )
}
