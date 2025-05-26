import { createContext } from "kaioken"
import { Template } from "./Template"
import { ClientRouter } from "./ClientRouter"

export type HeadData = {
  title?: string
  meta?: Record<string, string>
}

export const HeadContext = createContext<HeadData>({})

type WrapperProps = {
  head: HeadData
  path: string
  Page: () => JSX.Element
}

export const Wrapper = ({ head, path, Page }: WrapperProps) => {
  return (
    <HeadContext.Provider value={head}>
      <Template>
        <ClientRouter initialState={{ path, Page }} />
      </Template>
    </HeadContext.Provider>
  )
}
