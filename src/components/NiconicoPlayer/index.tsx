import { NiconicoEmbedPlayerEvents } from "apis/niconico/types";

/** 埋め込みプレイヤーを操作するためのID */
const NICONICO_EMBED_PLAYER_ID = "kikurui-niconico-embed-id";

type NiconicoPlayerProps = {
  /** 'smxxxx'のような文字列 */
  videoId: string;
};

export const NiconicoPlayer = ({ videoId }: NiconicoPlayerProps) => {
  return (
    <iframe
      width={600}
      height={480}
      style={{ background: "black" }}
      src={`https://embed.nicovideo.jp/watch/${videoId}?jsapi=1&playerId=${NICONICO_EMBED_PLAYER_ID}`}
    ></iframe>
  );
};
