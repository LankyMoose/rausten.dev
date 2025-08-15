import { createElement } from "kiru"
import { hydrate } from "kiru/ssr/client"
import { App } from "./app/App"
import { ClientRouter } from "./app/ClientRouter"
import { loadRouteByPath } from "./routes"

const path = window.location.pathname
loadRouteByPath(path).then(({ Page, Layout }) =>
  hydrate(App, document.body, {
    children: createElement(ClientRouter, { path, Page, Layout }),
  })
)
