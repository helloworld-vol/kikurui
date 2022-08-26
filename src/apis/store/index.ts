import * as z from "zod";

import { Festival, Video } from "types";
import { getLocalStorageValue } from "utils/helpers";

export type PlayHistory = z.infer<typeof PlayHistorySchema>;
export type PlayHistories = z.infer<typeof PlayHistoriesSchema>;
export type StoreItem = z.infer<typeof StoreItemSchema>;

export const PlayHistorySchema = z.object({
  contentId: z.string(),
  timer: z.number(),
});

export const PlayHistoriesSchema = z.record(PlayHistorySchema.optional());

export const StoreItemSchema = z.object({
  playHistories: PlayHistoriesSchema,
  favoriteVideos: z.string().array(),
});

/**
 * ローカルに保存していたデータを取得する
 */
export const getStoreItem = (festivalId: Festival["id"]): StoreItem => {
  const item = getLocalStorageValue(festivalId);
  const result = StoreItemSchema.safeParse(item);

  return result.success
    ? result.data
    : { playHistories: {}, favoriteVideos: [] };
};

/**
 * 渡された再生履歴を保存する
 */
export const savePlayHistory = (
  festivalId: Festival["id"],
  history: PlayHistory
) => {
  const item = getStoreItem(festivalId);

  item.playHistories[history.contentId] = history;

  localStorage.setItem(festivalId, JSON.stringify(item));
};

/**
 * お気に入りの動画を保存する
 */
export const saveFavoriteVideo = (festivalId: Festival["id"], video: Video) => {
  const item = getStoreItem(festivalId);

  item.favoriteVideos.push(video.contentId);

  localStorage.setItem(festivalId, JSON.stringify(item));
};
