const fpCache = new Map<string, string>()

/**
 * expects path like `./src/pages/index/page.tsx`, omits `.`, `pages`, and filename
 */
export function formatFilePath(path: string) {
  if (!fpCache.has(path)) {
    fpCache.set(path, formatFilePath_impl(path))
  }
  return fpCache.get(path)!
}

function formatFilePath_impl(path: string) {
  const parts = path
    .split("/")
    .filter((p) => !!p && !p.startsWith("(") && !p.endsWith(")"))
  const routePath = parts.slice(2, -1).join("/")
  if (routePath === "index") return "/"
  return `/${routePath}`
}
