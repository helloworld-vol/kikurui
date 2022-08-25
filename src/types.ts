import { ZodType } from "zod";

import { NiconicoApiResponseData } from "apis/niconico/types";

export type toZod<T extends Record<string, any>> = {
  [K in keyof T]-?: ZodType<T[K]>;
};

/**
 * ニコニコ動画で開催される祭の情報
 * @note イベント(event)だと分かりにくくなる可能性があるので祭(Festival)にしている
 */
export interface Festival {
  id: string;
  name: string;
  totalCount: number;
  videos: NiconicoApiResponseData[];
}
