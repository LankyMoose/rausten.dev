import { useCallback, useRef } from "kiru"
import { Link as L, LinkProps as LProps } from "kiru/router"
import { loadPageByPath } from "$/app/routes"

type LinkProps = LProps & {
  /**
   * Whether to prefetch the page
   * @default true
   */
  prefetch?: boolean
}
export function Link(props: LinkProps) {
  const didPrefetch = useRef(false)
  const handlePrefetch = useCallback(() => {
    if (didPrefetch.current || props.prefetch === false) return
    didPrefetch.current = true
    loadPageByPath(props.to)
  }, [])
  return <L {...props} onmouseover={handlePrefetch} onfocus={handlePrefetch} />
}
