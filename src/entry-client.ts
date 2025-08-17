import { hydrate } from "kiru/ssr/client"
import { App } from "./app"
import { loadRouteByPath } from "./routes"

const path = window.location.pathname
loadRouteByPath(path).then(({ Page, Layout }) =>
  hydrate(App, document.body, { path, Page, Layout })
)
