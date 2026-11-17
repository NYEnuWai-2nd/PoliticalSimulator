// 議員人生モードのセーブデータ。CareerState はそのまま JSON にし、名簿などの大きなデータ（CareerWorld）は
// 議員を一度ずつ書き出して、内閣は役職と議員の番号で持つ。候補者を作る道具は乱数の状態ごと保存するので、
// 読み込んだあとも保存しなかった場合と同じ展開になる。
import type { CareerState, CareerWorld } from "./career.js";
import { POSTS } from "./cabinet.js";
import type { Appointment } from "./cabinet.js";
import { restoreFactory } from "./roster.js";
import type { FactorySnapshot, Member } from "./roster.js";
import type { NameData } from "../data/nameData.js";

/** 2：小選挙区を289区にした（議員の district が県から区の番号に変わった） */
/** 3：物語の連作と人物との関係（story、bonds、pendingStory、voteBonus）を足した。2のデータもそのまま読める */
/** 4：能力の「資金」を「資金力」に改めた（読み込むときに付け替える） */
export const SAVE_VERSION = 4;
/** これより古いセーブデータは形が違うので読めない */
const MIN_SAVE_VERSION = 2;
const FORMAT = "seiji-career-save";

export interface SaveData {
  format: typeof FORMAT;
  version: number;
  savedAt: string;
  /** 名簿を作ったときのシード（同じ顔ぶれでやり直すときに使う） */
  worldSeed: number;
  state: CareerState;
  world: {
    roster: Member[];
    ronin: Member[];
    player: Member;
    government: { post: string; member: number; specialtyMatch: boolean }[];
    factory: FactorySnapshot;
  };
}

export function serializeCareer(state: CareerState, world: CareerWorld, worldSeed: number, now = new Date()): SaveData {
  return {
    format: FORMAT,
    version: SAVE_VERSION,
    savedAt: now.toISOString(),
    worldSeed,
    state,
    world: {
      roster: world.roster,
      ronin: world.ronin,
      player: world.player,
      government: world.government.map((a) => ({ post: a.post.id, member: a.member.id, specialtyMatch: a.specialtyMatch })),
      factory: world.factory.snapshot(),
    },
  };
}

/** 文字列（またはオブジェクト）がセーブデータとして読めるかを確かめる。読めなければ理由を投げる */
export function parseSave(input: string | unknown): SaveData {
  let data: unknown = input;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch {
      throw new Error("セーブデータの形式ではありません（ファイルの中身を読み取れません）");
    }
  }
  const d = data as Partial<SaveData>;
  if (!d || d.format !== FORMAT) throw new Error("議員人生モードのセーブデータではありません");
  if (typeof d.version !== "number" || d.version > SAVE_VERSION) throw new Error("このゲームより新しい版のセーブデータです");
  if (d.version < MIN_SAVE_VERSION) throw new Error("小選挙区が47区だったころの古いセーブデータは読めません（289区に変えたため）");
  if (!d.state || !d.world?.roster || !d.world.player || !d.world.factory) throw new Error("セーブデータが壊れています");
  return d as SaveData;
}

export async function deserializeCareer(save: SaveData, names: NameData): Promise<{ state: CareerState; world: CareerWorld }> {
  // 読み込んだデータを書き換えても元に影響しないよう、写しを使う
  const s = structuredClone(save);
  const roster = s.world.roster;
  // 持ち味を入れる前のセーブデータには skills がない
  for (const m of [...roster, ...s.world.ronin, s.world.player]) {
    m.skills ??= [];
    // 版4で能力の「資金」を「資金力」に改めた（それより前のセーブデータの名前を付け替える）
    const ab = m.abilities as unknown as Record<string, number>;
    if ("資金" in ab) {
      ab["資金力"] = ab["資金"];
      delete ab["資金"];
    }
  }
  // 議員のプレイヤーは名簿の中の本人と同じものにする
  const player = roster.find((m) => m.id === s.world.player.id) ?? s.world.player;
  const byId = new Map<number, Member>([...roster, ...s.world.ronin, player].map((m) => [m.id, m]));
  const government: Appointment[] = s.world.government.map((a) => {
    const post = POSTS.find((p) => p.id === a.post);
    const member = byId.get(a.member);
    if (!post || !member) throw new Error("セーブデータが壊れています（内閣）");
    return { post, member, specialtyMatch: a.specialtyMatch };
  });
  const factory = await restoreFactory(names, s.worldSeed, s.world.factory);
  return { state: s.state, world: { roster, ronin: s.world.ronin, government, factory, player } };
}

/** 一覧や「続きから」に出す短い説明 */
export function saveLabel(save: SaveData): string {
  const st = save.state;
  const p = save.world.player;
  return `${p.name.displayName}・${st.year}年${st.month}月・${st.post || st.status}`;
}
