import fs from "fs/promises";

import fetch from "node-fetch";
import * as z from "zod";

import {
  NiconicoSearchQuery,
  NiconicoApiResponse,
  NiconicoApiResponseData,
} from "./types";
import { NICONICO_API_ROOT, NICONICO_VIDEOS_PER_PAGE } from "./variables";

import { toZod } from "types";
import { wait } from "utils/helpers";

const iconicoApiResponseDataSchema = z.object<toZod<NiconicoApiResponseData>>({
  contentId: z.string(),
  title: z.string(),
  description: z.string(),
  viewCounter: z.number(),
  mylistCounter: z.number(),
  likeCounter: z.number(),
  lengthSeconds: z.number(),
  thumbnailUrl: z.string(),
  startTime: z.string(),
  tags: z.string(),
  userId: z.number().optional().nullable(),
  channelId: z.number().optional().nullable(),
  commentCounter: z.number().optional(),
});

const NicoNicoResponseSchema = z.object<toZod<NiconicoApiResponse>>({
  meta: z.object({
    id: z.string(),
    status: z.number(),
    totalCount: z.number().optional(),
    errorCode: z.string().optional(),
    errorMessage: z.string().optional(),
  }),

  data: iconicoApiResponseDataSchema.array(),
});

/**
 * ニコニコ動画から動画一覧情報を取得する
 */
export const getVideoInfoFromNiconico = async (
  query: NiconicoSearchQuery
): Promise<NiconicoApiResponse> => {
  const _query = query as unknown as Record<string, string>;

  if (_query._offset) _query._offset = `${query._offset}`;
  if (_query._limit) _query._limit = `${query._limit}`;

  // サービスまたはアプリケーション名を入れる（必須）
  _query._context = "Kikurui";

  const params = new URLSearchParams(_query);
  const apiPath = `${NICONICO_API_ROOT}?${params}`;

  const result = await fetch(apiPath).then((r) => r.json());

  const res = NicoNicoResponseSchema.parse(result);

  if (res.meta.status < 400) return res;

  throw new Error(res.meta.errorMessage || "エラーが発生しました");
};

type GetNiconicoVideoInfosByTagNameResult = {
  totalCount: number;
  data: NiconicoApiResponseData[];
};

/**
 * タグ名からデータ一覧を取得する
 */
export const getNiconicoVideoInfosByTagName = async (
  tagName: string
): Promise<GetNiconicoVideoInfosByTagNameResult> => {
  const query = {
    q: tagName,
    targets: "tags",
    _sort: "+startTime",
    _offset: 0,
    _limit: NICONICO_VIDEOS_PER_PAGE,
    fields:
      "contentId,title,description,userId,channelId,viewCounter,mylistCounter,likeCounter,lengthSeconds,thumbnailUrl,startTime,tags",
  };

  let videos: NiconicoApiResponseData[] = [];
  const firstResult = await getVideoInfoFromNiconico(query);

  const totalCount = firstResult.meta.totalCount || 1;

  videos = videos.concat(firstResult.data);

  if (totalCount <= query._limit) {
    return { data: videos, totalCount: videos.length };
  }

  const maxPage = Math.ceil(totalCount / query._limit);

  for (let i = 1; i < maxPage; i++) {
    console.log(`${query._limit * i}件を取得`);

    const result = await getVideoInfoFromNiconico({
      ...query,
      _offset: i * query._limit,
    });

    videos = videos.concat(result.data);

    if (result.data.length < query._limit) break;

    await wait(3000); // Dos攻撃にならないよう３秒待つ
  }

  return { data: videos, totalCount: videos.length };
};
