import { hydrate } from "kaioken/ssr/client"
import { Wrapper } from "./app/Wrapper"
import { loadPageByPath } from "./app/routes"

loadPageByPath(window.location.pathname).then((Page) =>
  hydrate(Wrapper, document.body, {
    path: window.location.pathname,
    Page,
    head: {},
  })
)
