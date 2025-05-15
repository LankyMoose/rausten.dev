import { defineConfig } from "vite"
import kaioken from "vite-plugin-kaioken"
import mdx from "@mdx-js/rollup"

export default defineConfig({
  optimizeDeps: {
    include: ["**/*.css"],
  },
  build: {
    outDir: "docs",
  },
  plugins: [
    kaioken(),
    mdx({
      jsx: false,
      jsxImportSource: "kaioken",
      jsxRuntime: "automatic",
    }),
  ],
})
