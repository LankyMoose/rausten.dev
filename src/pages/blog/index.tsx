import { getRouteMap } from "../../routes"
// @ts-ignore
import blogManifest from "virtual:blog-manifest"
export default function Page() {
  const routeMap = getRouteMap()
  console.log({ routeMap, blogManifest })
  return "my blogs!"
}
