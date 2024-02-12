import { defineConfig } from "vite"
import kaioken from "vite-plugin-kaioken"

// https://github.com/Applelo/unplugin-inject-preload

export default defineConfig({
  optimizeDeps: {
    include: ["**/*.css"],
  },
  build: {
    outDir: "docs",
  },
  esbuild: {
    jsxInject: `import * as kaioken from "kaioken"`,
    jsx: "transform",
    jsxFactory: "kaioken.createElement",
    jsxFragment: "kaioken.fragment",
    loader: "tsx",
    include: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"],
  },
  plugins: [kaioken()],
})
