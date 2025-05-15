import { App } from "./App"
import { ClientRouter } from "./components/ClientRouter"

export const Wrapper = ({
  path,
  Page,
}: {
  path: string
  Page: () => JSX.Element
}) => {
  return (
    <ClientRouter initialState={{ path, Page }} transition>
      <App />
    </ClientRouter>
  )
}
