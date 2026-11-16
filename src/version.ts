// 版の情報（ビルドのときに build-info.ts が埋め込む）
declare const __APP_VERSION__: string;
declare const __BUILD_COMMIT__: string;
declare const __BUILD_DATE__: string;

export const APP_VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "dev";
export const BUILD_COMMIT = typeof __BUILD_COMMIT__ === "string" ? __BUILD_COMMIT__ : "unknown";
export const BUILD_DATE = typeof __BUILD_DATE__ === "string" ? __BUILD_DATE__ : "";

/** 画面や CLI に出す1行（例：v0.0.1-alpha（16c9295・2026-11-16）） */
export const VERSION_LABEL = `v${APP_VERSION}（${BUILD_COMMIT}${BUILD_DATE ? `・${BUILD_DATE}` : ""}）`;
