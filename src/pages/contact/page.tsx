import Card from "$/components/Card"
import { Hero } from "$/components/Hero"
import { lazy } from "kiru"
import { Head } from "kiru/router"

const ContactForm = lazy(() => import("$/components/ContactForm"))

export default function Page() {
  return (
    <>
      <Head.Content>
        <title>Contact - rausten.dev</title>
        <meta
          name="description"
          content="Reach out to me if you have any questions, comments, or just want to say hi."
        />
      </Head.Content>
      <section>
        <Hero
          heading="Contact"
          sub="Reach out to me if you have any questions, comments, or just want to say hi."
        />
      </section>
      <section>
        <Card.Root tag="div">
          <ContactForm />
        </Card.Root>
      </section>
    </>
  )
}
