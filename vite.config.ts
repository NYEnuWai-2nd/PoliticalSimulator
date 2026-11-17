/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { buildDefines } from "./build-info.js";

// GitHub Pages ではリポジトリ名の下（/<repo>/）に置かれるため、相対パスで書き出す。
// index.html が議員人生モード、legacy.html が首相モードの試作の画面。
export default defineConfig({
  base: "./",
  define: buildDefines(),
  // 名簿（465人）を何度も作るテストがあるので、既定の時間の上限を長めにする
  test: { testTimeout: 30_000 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        legacy: resolve(import.meta.dirname, "legacy.html"),
      },
    },
  },
});
