import { useEffect, useRef, useState } from "react";

import { listenNiconicoEmbedPlayerEvent } from "apis/niconico/embed";

interface Props {
  onUpdateTimer?: (time: number) => void;
  onStopTimer?: (time: number) => void;
}

interface RefValue {
  timer: number;
  clearId: number | null;
}

/**
 * ニコニコ埋め込みプレイヤーの再生時間を監視するHooks
 */
export const useNiconicoPlayerTimer = (props: Props) => {
  const { onUpdateTimer, onStopTimer } = props;

  const ref = useRef<RefValue>({ timer: 0, clearId: null });

  const stopTimer = () => {
    const { timer, clearId } = ref.current;
    if (!clearId) return;

    onStopTimer?.(timer);
    clearInterval(clearId);
    console.log("タイマーSTOP", { timer });
  };

  useEffect(() => {
    const unsubcribe = listenNiconicoEmbedPlayerEvent({
      onPlayed() {
        const current = ref.current;

        current.clearId = window.setInterval(() => {
          current.timer += 1;
          console.log("タイマー更新！", { timer: current.timer });
          onUpdateTimer?.(current.timer);
        }, 1000);
      },

      onPaused() {
        stopTimer();
      },

      onPlayEnd() {
        stopTimer();
      },
    });

    return () => {
      unsubcribe();
      stopTimer();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    stopTimer,
  };
};
