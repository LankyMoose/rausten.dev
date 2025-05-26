import { createContext } from "kaioken"
import { App } from "./App"
import { ClientRouter } from "$/components/ClientRouter"

export type HeadData = {
  title?: string
  meta?: Record<string, string>
}

export const HeadContext = createContext({
  head: {} as HeadData,
})

export const Wrapper = ({
  path,
  Page,
  head,
}: {
  path: string
  Page: () => JSX.Element
  head: HeadData
}) => {
  return (
    <HeadContext.Provider value={{ head }}>
      <ClientRouter initialState={{ path, Page }}>
        <App />
      </ClientRouter>
    </HeadContext.Provider>
  )
}
