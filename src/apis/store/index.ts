import * as z from "zod";

import { Festival } from "types";
import { getLocalStorageValue } from "utils/helpers";

export type PlayHistory = z.infer<typeof PlayHistorySchema>;
export type PlayHistories = z.infer<typeof PlayHistoriesSchema>;

export const PlayHistorySchema = z.object({
  contentId: z.string(),
  timer: z.number(),
});

export const PlayHistoriesSchema = z.record(PlayHistorySchema.optional());

/**
 * 保存されている再生履歴情報を返す
 */
export const getPlayHistories = (festivalId: Festival["id"]): PlayHistories => {
  const playHistories = getLocalStorageValue(festivalId);
  const result = PlayHistoriesSchema.safeParse(playHistories);

  return result.success ? result.data : {};
};

/**
 * 渡された再生履歴を保存する
 */
export const savePlayHistory = (
  festivalId: Festival["id"],
  history: PlayHistory
) => {
  const histories = getPlayHistories(festivalId);

  histories[history.contentId] = history;

  localStorage.setItem(festivalId, JSON.stringify(histories));
};
