import { ElementProps, useCallback, useRef } from "kiru"
import { loadRouteByPath } from "$/routes"

type LinkProps = ElementProps<"a"> & {
  to: string
  /**
   * Whether to prefetch the page
   * @default true
   */
  prefetch?: boolean
}
export function Link({ to, prefetch, onclick, ...props }: LinkProps) {
  const didPrefetch = useRef(false)
  const handlePrefetch = useCallback(() => {
    if (didPrefetch.current || prefetch === false) return
    didPrefetch.current = true
    loadRouteByPath(to)
  }, [])

  const onClick = useCallback((e: Kiru.MouseEvent<HTMLAnchorElement>) => {
    onclick?.(e)
    if (e.defaultPrevented) return
    e.preventDefault()
    window.history.pushState({}, "", to)
    window.dispatchEvent(new PopStateEvent("popstate", { state: {} }))
  }, [])

  return (
    <a
      {...props}
      href={to}
      onclick={onClick}
      onmouseover={handlePrefetch}
      onfocus={handlePrefetch}
    />
  )
}
