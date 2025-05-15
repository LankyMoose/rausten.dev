import { getRouteMap } from "../../routes"
export default function Page() {
  const routeMap = getRouteMap()
  console.log(routeMap)
  return "my blogs!"
}
