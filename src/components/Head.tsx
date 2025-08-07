import { isVNode } from "kiru/utils"

export function Head({ children }: { children: JSX.Children }) {
  if ("window" in globalThis) {
    ;(Array.isArray(children) ? children : [children])
      .filter(isVNode)
      .forEach(({ type, props }) => {
        switch (type) {
          case "title":
            return (document.title = String(props.children))
          case "meta":
            return document
              .querySelector(`meta[name="${props.name}"]`)!
              .setAttribute("content", String(props.content))
        }
      })
    return null
  }
  return <head>{children}</head>
}
