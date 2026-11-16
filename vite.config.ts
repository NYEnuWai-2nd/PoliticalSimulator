import { defineConfig } from "vite";

// GitHub Pages ではリポジトリ名の下（/<repo>/）に置かれるため、相対パスで書き出す
export default defineConfig({
  base: "./",
});
