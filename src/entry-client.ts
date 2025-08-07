import { createElement } from "kiru"
import { hydrate } from "kiru/ssr/client"
import { App } from "./app/App"
import { ClientRouter } from "./app/ClientRouter"
import { loadPageByPath } from "./app/routes"

const path = window.location.pathname
loadPageByPath(path).then((Page) =>
  hydrate(App, document.body, {
    children: createElement(ClientRouter, { path, Page }),
  })
)
