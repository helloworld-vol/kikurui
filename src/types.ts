import { ZodType } from "zod";

import { NiconicoApiResponseData } from "apis/niconico/types";

export type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: ZodType<T[K]>;
};

/**
 * 分かりやすくするために Video 型として定義する
 */
export interface Video extends NiconicoApiResponseData {}

export interface FestivalMeta {
  id: string;
  name: string;
}

/**
 * 開催される祭の情報
 * @note イベント(event)だと分かりにくくなる可能性があるので祭(Festival)にしている
 */
export interface Festival extends FestivalMeta {
  videos: Video[];
  totalCount: number;
}
