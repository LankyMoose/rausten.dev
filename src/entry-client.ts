import { createElement } from "kaioken"
import { hydrate } from "kaioken/ssr/client"
import { App } from "./app/App"
import { ClientRouter } from "./app/ClientRouter"
import { loadPageByPath } from "./app/routes"

const path = window.location.pathname
loadPageByPath(path).then((Page) =>
  hydrate(App, document.body, {
    children: createElement(ClientRouter, { path, Page }),
  })
)
