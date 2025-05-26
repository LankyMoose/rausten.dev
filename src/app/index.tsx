import { Template } from "./Template"
import { ClientRouter } from "./ClientRouter"

export * from "./ClientRouter"
export * from "./routes"

type AppProps = {
  path: string
  Page: () => JSX.Element
}

export const App = ({ path, Page }: AppProps) => {
  return (
    <Template>
      <ClientRouter initialState={{ path, Page }} />
    </Template>
  )
}
