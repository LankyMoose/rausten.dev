import { useCallback, useRef } from "kaioken"
import { Link as L, LinkProps as LProps } from "kaioken/router"
import { loadPageByPath } from "$/app"

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
