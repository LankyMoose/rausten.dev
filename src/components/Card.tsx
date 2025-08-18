import { createElement, unwrap, type ElementProps } from "kiru"
import { className as cls } from "kiru/utils"

export default {
  Root,
  Header,
  Footer,
}

type RootProps<T extends keyof JSX.IntrinsicElements> = ElementProps<T> & {
  tag?: string
}
function Root<T extends keyof JSX.IntrinsicElements = "li">({
  className,
  ...props
}: RootProps<T>) {
  return createElement(props.tag || "li", {
    className: cls("card w-full grow flex flex-col gap-2", unwrap(className)),
    ...props,
  })
}

function Header({ className, ...props }: ElementProps<"div">) {
  return (
    <div
      className={cls(
        "flex gap-2 items-center justify-between",
        unwrap(className)
      )}
      {...props}
    />
  )
}
function Footer({ className, ...props }: ElementProps<"div">) {
  return <span className="text-neutral-300 font-light text-sm" {...props} />
}
