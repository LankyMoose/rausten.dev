import { ElementProps } from "kaioken"

export function SocialLink(props: ElementProps<"a">) {
  return (
    <a
      className="rounded-full border-2 border-current p-1 opacity-75 hover:bg-neutral-100/10 hover:opacity-100"
      target="_blank"
      {...props}
    />
  )
}
