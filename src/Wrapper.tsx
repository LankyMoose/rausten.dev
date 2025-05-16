import { App } from "./App"
import { ClientRouter } from "./components/ClientRouter"
import { HeadContext, HeadData } from "./Head"

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
