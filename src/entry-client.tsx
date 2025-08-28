import { hydrate } from "kiru/ssr/client"
import { App } from "./app"
import { loadRouteByPath } from "./routes"

const path = window.location.pathname
loadRouteByPath(path).then((routeComponents) =>
  hydrate(<App initialState={{ path, ...routeComponents }} />, document.body)
)
