import blogManifest from "virtual:blog-manifest"

export const blogLinkData = Object.keys(blogManifest)
  .sort(
    (a, b) =>
      new Date(b.replace("/blog/", "")).getTime() -
      new Date(a.replace("/blog/", "")).getTime()
  )
  .map((path) => ({ path, ...blogManifest[path] }))
