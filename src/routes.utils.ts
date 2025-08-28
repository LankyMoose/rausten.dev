const fpCache = new Map<string, string>()

/**
 * expects path like `./src/pages/index/page.tsx`, omits `.`, `pages`, and filename
 */
export function formatFilePath(path: string) {
  return getOrSetMapEntryFromFactory(fpCache, path, () =>
    formatFilePath_impl(path)
  )
}

function formatFilePath_impl(path: string) {
  const parts = path
    .split("/")
    .filter((p) => !!p && !p.startsWith("(") && !p.endsWith(")"))
  const routePath = parts.slice(2, -1).join("/")
  if (routePath === "index") return "/"
  return `/${routePath}`
}

export function getOrSetMapEntryFromFactory<K, V>(
  map: Map<K, V>,
  key: K,
  factory: () => V
) {
  if (!map.has(key)) {
    map.set(key, factory())
  }
  return map.get(key)!
}
