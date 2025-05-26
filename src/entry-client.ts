import { hydrate } from "kaioken/ssr/client"
import { App } from "./app"
import { loadPageByPath } from "./app/routes"

loadPageByPath(window.location.pathname).then((Page) =>
  hydrate(App, document.body, {
    path: window.location.pathname,
    Page,
    head: {},
  })
)
