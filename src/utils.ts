export async function parseThrowErr(res: Response) {
  let msg: string | null = null
  try {
    const parsed = await res.json()
    if ("message" in parsed && typeof parsed.message === "string") {
      msg = parsed.message
      if (parsed.message.startsWith("API rate limit exceeded")) {
        msg = "API rate limit exceeded. Please try again later."
      }
      return
    }
    return parsed
  } catch (error) {
    throw new Error(res.ok ? "Failed to parse response" : res.statusText)
  } finally {
    if (msg) {
      throw new Error(msg)
    }
  }
}
