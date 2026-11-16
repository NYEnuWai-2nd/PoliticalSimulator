// 想定図の HTML にアイコンを埋め込む。{{アイコンのid:大きさ}} を src/ui/icons.js の SVG に置き換える
// （ファイルを直接開いた HTML からはモジュールを読み込めないため、SVG を書き込んだ HTML を作る）
// 使い方: node docs/mockups/build_mockup.mjs <入力.src.html> <出力.html>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const { iconSvg, ICONS } = await import(pathToFileURL(resolve(here, "../../src/ui/icons.js")).href);
const [src, out] = process.argv.slice(2);
const html = readFileSync(src, "utf8").replace(/\{\{([a-z0-9-]+):(\d+)\}\}/g, (_m, id, size) => {
  if (!ICONS[id]) throw new Error(`未知のアイコンです：${id}`);
  return iconSvg(id, Number(size), "");
});
writeFileSync(out, html);
