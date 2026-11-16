// ビルドしたときの版の情報を、画面と CLI に埋め込む（vite.config.ts と vite.cli.config.ts の define で使う）。
// 版の番号は package.json の version、コミットはビルドしたときの git の短いハッシュ。
// GitHub Pages に公開されているものとリポジトリのものが同じかを、画面の表示で見比べられるようにする。
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function git(args: string): string {
  try {
    return execSync(`git ${args}`, { cwd: import.meta.dirname, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

export function buildDefines(): Record<string, string> {
  const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, "package.json"), "utf8")) as { version: string };
  const commit = git("rev-parse --short HEAD") || "unknown";
  // コミットしていない変更を含むビルド（手元の開発中）には印を付ける
  const dirty = git("status --porcelain --untracked-files=no") !== "";
  return {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_COMMIT__: JSON.stringify(dirty ? `${commit}+変更あり` : commit),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  };
}
