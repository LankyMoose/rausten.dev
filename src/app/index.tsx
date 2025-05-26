import { createContext } from "kaioken"
import { Template } from "./Template"
import { ClientRouter } from "./ClientRouter"

export * from "./ClientRouter"
export * from "./routes"

export type HeadData = {
  title?: string
  meta?: Record<string, string>
}

export const HeadContext = createContext<HeadData>({})

type AppProps = {
  head: HeadData
  path: string
  Page: () => JSX.Element
}

export const App = ({ head, path, Page }: AppProps) => {
  return (
    <HeadContext.Provider value={head}>
      <Template>
        <ClientRouter initialState={{ path, Page }} />
      </Template>
    </HeadContext.Provider>
  )
}
