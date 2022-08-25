import styles from "./NiconicoPlayer.module.scss";

/** 埋め込みプレイヤーを操作するためのID */
const NICONICO_EMBED_PLAYER_ID = "kikurui-niconico-embed-id";

type NiconicoPlayerProps = {
  width?: string | number;
  height?: string | number;
  /** 'smxxxx'のような文字列 */
  videoId?: string;
};

export const NiconicoPlayer = ({
  videoId,
  width,
  height,
}: NiconicoPlayerProps) => {
  return (
    <iframe
      className={styles.player}
      width={width}
      height={height}
      style={{ background: "black" }}
      src={
        videoId
          ? `https://embed.nicovideo.jp/watch/${videoId}?jsapi=1&playerId=${NICONICO_EMBED_PLAYER_ID}`
          : void 0
      }
    ></iframe>
  );
};
