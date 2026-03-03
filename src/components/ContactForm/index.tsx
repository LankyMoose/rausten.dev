import { Derive, onMount, signal } from "kiru"
import { validateFieldValueLength } from "./utils"
import { FormFieldWrapper } from "./FormFieldWrapper"
import { Loader } from "../Loader"
import { createFormController } from "$/features/form"

const RECAPTCHA_SITE_KEY = "6Lfjh6krAAAAAFJsIRSW8C5Zs0kAwRW8iZz3TQuZ"
let hasLoadedRecaptcha = false
export default function ContactForm() {
  const sent = signal(false)
  const submissionError = signal<string | null>(null)
  const form = createFormController({
    initialState: { name: "", email: "", message: "" },
    validators: {
      name: (v) => validateFieldValueLength("Name", v, 3, 100) ?? null,
      email: (value) => {
        if (!value) {
          return "Email is required"
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Invalid email format"
        }
      },
      message: (v) => validateFieldValueLength("Message", v, 32, 256) ?? null,
    },
    onSubmit: async (values) => {
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
          body: JSON.stringify({
            ...values,
            token,
          }),
          credentials: "same-origin",
        })
        const data = await response.json()
        const success = !!data.success
        sent.value = success
        if (!success && data.error) {
          submissionError.value = data.error
        } else {
          submissionError.value = null
        }
        return success
      } catch (error) {
        console.error(error)
        sent.value = false
        submissionError.value = "An error occurred while submitting the form"
        return false
      }
    },
  })

  onMount(() => {
    if (hasLoadedRecaptcha) return
    hasLoadedRecaptcha = true
    document.head.appendChild(
      Object.assign(document.createElement("script"), {
        src: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`,
      })
    )
  })

  return () => {
    if (sent.value) {
      return (
        <div className="text-center text-lg font-bold">
          Message Sent! Sit tight and I'll get back to you ASAP.
        </div>
      )
    }

    return (
      <form
        className="flex flex-col gap-4"
        onsubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {({ state, error, validate }) => (
            <FormFieldWrapper for="name" label="Name" error={error}>
              <input
                required
                id="name"
                type="text"
                bind:value={state}
                oninput={validate}
                onblur={validate}
              />
            </FormFieldWrapper>
          )}
        </form.Field>
        <form.Field name="email">
          {({ state, error, validate }) => (
            <FormFieldWrapper for="email" label="Email" error={error}>
              <input
                required
                id="email"
                type="email"
                bind:value={state}
                oninput={validate}
                onblur={validate}
              />
            </FormFieldWrapper>
          )}
        </form.Field>
        <form.Field name="message">
          {({ state, error, validate }) => (
            <FormFieldWrapper for="message" label="Message" error={error}>
              <textarea
                required
                id="message"
                bind:value={state}
                oninput={validate}
                onblur={validate}
              />
            </FormFieldWrapper>
          )}
        </form.Field>
        <div className="flex justify-between">
          <div>
            <Derive from={submissionError}>
              {(error) =>
                error && <div className="text-red-400 text-sm">{error}</div>
              }
            </Derive>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={form.canNotSubmit}
          >
            Send{" "}
            <Derive from={form.isSubmitting}>
              {(isSubmitting) => isSubmitting && <Loader />}
            </Derive>
          </button>
        </div>
      </form>
    )
  }
}
