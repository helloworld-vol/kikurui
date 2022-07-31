import { NiconicoEmbedPlayerEvent, NiconicoEmbedPlayerEvents } from "./types";

type EmbedCallbacks = {
  onLoad?: (event: NiconicoEmbedPlayerEvents["loadComplete"]) => void;
  onReady?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPlayed?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPaused?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
  onPlayEnd?: (event: NiconicoEmbedPlayerEvents["playerStatusChange"]) => void;
};

export const listenNiconicoEmbedPlayerEvent = (callbacks: EmbedCallbacks) => {
  const onMessage = (event: MessageEvent) => {
    if (event.origin !== "https://embed.nicovideo.jp") return;

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
