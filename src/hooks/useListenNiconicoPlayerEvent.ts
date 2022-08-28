import { useEffect } from "react";

import {
  EmbedCallbacks,
  listenNiconicoEmbedPlayerEvent,
} from "apis/niconico/embed";

/**
 * ニコニコ埋め込みプレイヤーのイベントを監視するHooks
 */
export const useListenNiconicoPlayerEvent = (
  callbacks: EmbedCallbacks,
  deps: any[]
) => {
  useEffect(() => {
    const unsubcribe = listenNiconicoEmbedPlayerEvent(callbacks);

    return () => {
      unsubcribe();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return {};
};
