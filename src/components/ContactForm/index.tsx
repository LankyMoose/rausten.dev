import { useLayoutEffect, useSignal, Derive } from "kiru"
import { useForm } from "kiru/form"
import { validateFieldValueLength } from "./utils"
import { FormFieldWrapper } from "./FormFieldWrapper"
import { Loader } from "../Loader"

const RECAPTCHA_SITE_KEY = "6Lfjh6krAAAAAFJsIRSW8C5Zs0kAwRW8iZz3TQuZ"
let hasLoadedRecaptcha = false

export default function ContactForm() {
  useLayoutEffect(() => {
    if (hasLoadedRecaptcha) return
    hasLoadedRecaptcha = true
    document.head.appendChild(
      Object.assign(document.createElement("script"), {
        src: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`,
      })
    )
  }, [])
  const sent = useSignal(false)
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    async onSubmit({ state }) {
      const { name, email, message } = state
      try {
        await new Promise<void>((resolve) => grecaptcha.ready(resolve))
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action: "submit",
        })
        const response = await fetch("https://rausten.dev/mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message, token }),
          credentials: "same-origin",
        })
        const data = await response.json()
        sent.value = !!data.success
        form.reset()
      } catch (error) {
        console.error(error)
        sent.value = false
      }
    },
  })

  return (
    <>
      <Derive from={sent}>
        {(sent) =>
          sent ? (
            <div className="text-center text-lg font-bold">
              Message Sent! Sit tight and I'll get back to you ASAP.
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onsubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    validateFieldValueLength("Name", value, 3, 100),
                }}
                children={(field) => (
                  <FormFieldWrapper field={field}>
                    <input
                      required
                      id="name"
                      type="text"
                      value={field.state.value}
                      onblur={field.handleBlur}
                      oninput={(e) => field.handleChange(e.target.value)}
                    />
                  </FormFieldWrapper>
                )}
              />
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "Email is required"
                    if (!/\S+@\S+\.\S+/.test(value))
                      return "Invalid email format"
                  },
                }}
                children={(field) => (
                  <FormFieldWrapper field={field}>
                    <input
                      required
                      id="email"
                      type="email"
                      value={field.state.value}
                      onblur={field.handleBlur}
                      oninput={(e) => field.handleChange(e.target.value)}
                    />
                  </FormFieldWrapper>
                )}
              />
              <form.Field
                name="message"
                validators={{
                  onChange: ({ value }) =>
                    validateFieldValueLength("Message", value, 32, 256),
                }}
                children={(field) => (
                  <FormFieldWrapper field={field}>
                    <textarea
                      required
                      id="message"
                      value={field.state.value}
                      onblur={field.handleBlur}
                      oninput={(e) => field.handleChange(e.target.value)}
                    />
                  </FormFieldWrapper>
                )}
              />
              <div className="flex justify-end">
                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!canSubmit || isSubmitting}
                    >
                      Send {isSubmitting && <Loader />}
                    </button>
                  )}
                </form.Subscribe>
              </div>
            </form>
          )
        }
      </Derive>
    </>
  )
}
