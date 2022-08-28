import styles from "./NiconicoPlayer.module.scss";

type NiconicoPlayerProps = {
  /** 埋め込みプレイヤーを操作するためのID */
  playerId: string;

  width?: string | number;

  height?: string | number;

  /** 'smxxxx'のような文字列 */
  videoId?: string;
};

export const NiconicoPlayer = ({
  playerId,
  videoId,
  width,
  height,
}: NiconicoPlayerProps) => {
  return (
    <iframe
      id={playerId}
      className={styles.player}
      width={width}
      height={height}
      style={{ background: "black" }}
      src={
        videoId
          ? `https://embed.nicovideo.jp/watch/${videoId}?jsapi=1&playerId=${playerId}`
          : void 0
      }
    ></iframe>
  );
};
