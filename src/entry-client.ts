import { hydrate } from "kaioken/ssr/client"
import { Wrapper } from "./Wrapper"
import { loadPageByPath } from "./utils"

loadPageByPath(window.location.pathname).then((Page) =>
  hydrate(Wrapper, document.body, {
    path: window.location.pathname,
    Page,
    head: {},
  })
)
