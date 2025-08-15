import blogManifest from "virtual:blog-manifest"

export const blogLinkData = Object.keys(blogManifest)
  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  .map((path) => ({ path, ...blogManifest[path] }))
