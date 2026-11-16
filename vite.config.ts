import { defineConfig } from "vite";
import { resolve } from "node:path";

// GitHub Pages ではリポジトリ名の下（/<repo>/）に置かれるため、相対パスで書き出す。
// index.html が議員人生モード、legacy.html が首相モードの試作の画面。
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        legacy: resolve(import.meta.dirname, "legacy.html"),
      },
    },
  },
});
