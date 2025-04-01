import { hydrate } from "kaioken/ssr/client"
import { App } from "./App"

hydrate(App, document.body)
