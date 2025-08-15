/**
 * expects path like `./src/pages/index/page.tsx`, omits `.`, `pages`, and filename
 */
export function formatFilePath(path: string) {
  const routePath = "/" + path.split("/").slice(2, -1).join("/")
  if (routePath === "/index") return "/"
  return routePath
}
