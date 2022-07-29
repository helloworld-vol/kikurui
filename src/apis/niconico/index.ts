import fs from "fs/promises";
import * as z from "zod";
import fetch from "node-fetch";
import {
  NiconicoSearchQuery,
  NiconicoApiResponse,
  NiconicoApiResponseData,
} from "./types";
import { toZod } from "types";

const NICONICO_API_ROOT =
  "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search";

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

  console.log("============ RESULT ==============");
  console.log({ apiPath, result });
  console.log("============ RESULT ==============");

  const res = NicoNicoResponseSchema.parse(result);

  if (res.meta.status < 400) return res;

  throw new Error(res.meta.errorMessage || "エラーが発生しました");
};

/**
 * ニコニコ動画検索APIの結果をファイルに出力する
 */
export const generateNiconicoVideoInfos = async (
  id: string,
  query: NiconicoSearchQuery
) => {
  const result = await getVideoInfoFromNiconico(query);

  const folder = `./public/apis/niconico/${id}`;

  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(`${folder}/videos.json`, JSON.stringify(result.data));
};
