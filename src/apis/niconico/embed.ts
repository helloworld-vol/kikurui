import { NiconicoEmbedPlayerEvent, NiconicoEmbedPlayerEvents } from "./types";

/**
 * ニコニコ動画の埋め込みプレイヤーのオリジンURL
 */
export const NICONICO_EMBED_PLAYER_ORIGIN = "https://embed.nicovideo.jp";

/**
 * `listenNiconicoEmbedPlayerEvent`の引数型
 */
export type EmbedCallbacks = {
  onLoad?: (event: NiconicoEmbedPlayerEvents["loadComplete"]) => void;
  onReady?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPlayed?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPaused?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPlayEnd?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
};

/**
 * ニコニコ動画の埋め込みプレイヤーのイベントを受け取る関数を設定する
 */
export const listenNiconicoEmbedPlayerEvent = (callbacks: EmbedCallbacks) => {
  const onMessage = (event: MessageEvent) => {
    if (event.origin !== NICONICO_EMBED_PLAYER_ORIGIN) return;

    const embedEvent = event.data as NiconicoEmbedPlayerEvent;

    switch (embedEvent.eventName) {
      case "loadComplete": {
        callbacks.onLoad?.(embedEvent);
        break;
      }

      case "playerStatusChange": {
        // 準備中
        if (embedEvent.data.playerStatus === 1) {
          callbacks.onReady?.(embedEvent);
        }

        // 再生
        if (embedEvent.data.playerStatus === 2) {
          callbacks.onPlayed?.(embedEvent);
        }

        // 一時停止
        if (embedEvent.data.playerStatus === 3) {
          callbacks.onPaused?.(embedEvent);
        }

        // 再生終了
        if (embedEvent.data.playerStatus === 4) {
          callbacks.onPlayEnd?.(embedEvent);
        }

        break;
      }
    }
  };

  window.addEventListener("message", onMessage);

  return () => {
    window.removeEventListener("message", onMessage);
  };
};

/**
 * ニコニコ動画の埋め込みプレイヤーへイベントを送信する
 */
export const sendEventToNiconicoEmbedPlayer = (
  playerId: string,
  event: NiconicoEmbedPlayerEvent
) => {
  const player = document.getElementById(playerId);

  if (player instanceof HTMLIFrameElement && player.contentWindow) {
    player.contentWindow.postMessage(event, NICONICO_EMBED_PLAYER_ORIGIN);
    return;
  }

  throw new Error("送信先の埋め込みプレイヤーがありませんでした");
};
