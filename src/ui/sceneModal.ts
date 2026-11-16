// 場面のポップアップ。パワプロの会話のように、名札とセリフを1行ずつ見せ、文字を少しずつ出す。
// クリックか Enter／Space で、表示途中なら全文を出し、出し終わっていれば次のセリフへ進む。
import type { GameState } from "../game/game.js";
import type { SceneLine } from "../game/scenes.js";
import { partyById } from "../game/parties.js";
import { escapeHtml } from "./format.js";

/** 1文字を出す間隔（ミリ秒） */
const CHAR_MS = 28;

let open = false;

/** ポップアップが開いているか（開いている間はほかのキー操作を止める） */
export const isSceneOpen = () => open;

function nameplate(line: SceneLine): string {
  if (!line.name) return `<div class="plate narrator"></div>`;
  const color = line.party ? partyById(line.party).color : "#6b7280";
  // 顔の代わりに、名字の1文字目を党の色の札に出す
  const face = line.name.slice(0, 1);
  return `<div class="plate" style="--plate:${color}">
      <span class="face">${escapeHtml(face)}</span>
      <span class="plate-text"><span class="plate-role">${escapeHtml(line.role)}</span><span class="plate-name">${escapeHtml(line.name)}</span></span>
    </div>`;
}

/**
 * 状態に積まれた場面を順に見せる。すべて見せ終わったら onDone を呼ぶ。
 * 見せた場面は state.scenes から取り除く。
 */
export function showScenes(state: GameState, onDone: () => void): void {
  if (open || !state.scenes.length) return;
  open = true;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const overlay = document.createElement("div");
  overlay.className = "scene-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  document.body.appendChild(overlay);

  let lineIndex = 0;
  let timer: number | undefined;
  let typing = false;

  const scene = () => state.scenes[0];

  function close(): void {
    window.clearInterval(timer);
    window.removeEventListener("keydown", onKey, true);
    overlay.remove();
    open = false;
    onDone();
  }

  function renderLine(): void {
    const sc = scene();
    const line = sc.lines[lineIndex];
    const isNarration = !line.name;
    overlay.innerHTML = `<div class="scene-box">
        <div class="scene-title">${escapeHtml(sc.title)}<span class="scene-count">${lineIndex + 1} / ${sc.lines.length}${state.scenes.length > 1 ? `　残り${state.scenes.length - 1}場面` : ""}</span></div>
        ${nameplate(line)}
        <p class="scene-text${isNarration ? " narration" : ""}" aria-live="polite"></p>
        <div class="scene-hint">クリック／Enter で進む　<button class="scene-skip" type="button">この場面を飛ばす</button></div>
      </div>`;
    const textEl = overlay.querySelector<HTMLElement>(".scene-text")!;
    overlay.querySelector<HTMLButtonElement>(".scene-skip")!.addEventListener("click", (e) => {
      e.stopPropagation();
      nextScene();
    });
    const chars = [...line.text];
    if (reduce) {
      textEl.textContent = line.text;
      typing = false;
      return;
    }
    let i = 0;
    typing = true;
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      i++;
      textEl.textContent = chars.slice(0, i).join("");
      if (i >= chars.length) {
        window.clearInterval(timer);
        typing = false;
      }
    }, CHAR_MS);
  }

  function nextScene(): void {
    window.clearInterval(timer);
    state.scenes.shift();
    lineIndex = 0;
    if (state.scenes.length) renderLine();
    else close();
  }

  function advance(): void {
    if (typing) {
      // 表示途中なら全文を出す
      window.clearInterval(timer);
      typing = false;
      overlay.querySelector<HTMLElement>(".scene-text")!.textContent = scene().lines[lineIndex].text;
      return;
    }
    lineIndex++;
    if (lineIndex < scene().lines.length) renderLine();
    else nextScene();
  }

  function onKey(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      advance();
    } else if (e.key === "Escape") {
      e.preventDefault();
      nextScene();
    }
    // ポップアップの間は、画面の切り替えなどのキーを止める
    e.stopPropagation();
  }

  overlay.addEventListener("click", advance);
  window.addEventListener("keydown", onKey, true);
  renderLine();
}
