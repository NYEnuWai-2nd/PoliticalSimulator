import { defineConfig } from "vite";
import { buildDefines } from "./build-info.js";

// CLI 版（議員人生モード）を、Node.js だけで動く1つのファイル cli/seiji.mjs にまとめる。
// 名前データなどの JSON も中に含める。
export default defineConfig({
  define: buildDefines(),
  build: {
    ssr: "src/cli/main.ts",
    outDir: "cli",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      output: { entryFileNames: "seiji.mjs", format: "es", inlineDynamicImports: true },
    },
  },
  ssr: { noExternal: true },
});
