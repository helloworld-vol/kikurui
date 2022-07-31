import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./index.module.scss";

import type { NiconicoApiResponseData } from "apis/niconico/types";
import type { GetStaticProps, NextPage } from "next";

import { getNiconicoVideoInfosByTagName } from "apis/niconico";
import { listenNiconicoEmbedPlayerEvent } from "apis/niconico/embed";
import { NiconicoPlayer } from "components/NiconicoPlayer";

interface HogePageProps {
  event: {
    id: string;
    name: string;
    totalCount: number;
    data: NiconicoApiResponseData[];
  };
}

type PlayHistory = {
  history: { [key: string]: { timer: number } };
};

const getPlayHistory = (id: string): PlayHistory => {
  try {
    const data = localStorage.getItem(id) as string;
    return data ? JSON.parse(data) : { history: {} };
  } catch {
    return { history: {} };
  }
};

const Home: NextPage<HogePageProps> = ({ event }) => {
  const videos = event.data;
  const playHistory = getPlayHistory(event.id).history;

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    let timer = 0;
    let clearId: number | null = null;

    const currentVideo = videos[currentVideoIndex];
    const stopTimer = () => {
      if (!clearId) return;

      clearInterval(clearId);
      console.log("タイマーSTOP", { timer });
    };

    const unsubcribe = listenNiconicoEmbedPlayerEvent({
      onPlayed() {
        clearId = window.setInterval(() => {
          const threshold = 10; // Math.round(currentVideo.lengthSeconds / 7);

          timer += 1;

          console.log("タイマー更新！", { timer });

          if (timer >= threshold) {
            const store = getPlayHistory(event.id);

            store.history = {
              ...store.history,
              [currentVideo.contentId]: { timer },
            };

            localStorage.setItem(event.id, JSON.stringify(store));
            console.log("ローカルに保存しました", { store });
          }
        }, 1000);
      },

      onPaused() {
        stopTimer();
      },

      onPlayEnd() {
        const nextIndex = Math.min(currentVideoIndex + 1, videos.length - 1);

        stopTimer();
        setCurrentVideoIndex(nextIndex);
      },
    });

    return () => {
      unsubcribe();
      stopTimer();
    };
  }, [event, videos, currentVideoIndex]);

  return (
    <div>
      <h1>{event.name}の投稿作品一覧</h1>

      <span>進捗度: {Math.round(currentVideoIndex / videos.length)}%</span>

      {!!videos[currentVideoIndex] && (
        <NiconicoPlayer videoId={videos[currentVideoIndex].contentId} />
      )}

      <ul>
        {videos.map((video, i) => (
          <li
            key={video.contentId}
            className={styles.videoItem}
            onClick={() => setCurrentVideoIndex(i)}
          >
            <div>
              <Image
                src={video.thumbnailUrl}
                alt="Landscape picture"
                width={130}
                height={100}
              />
            </div>

            <div>
              <div>
                {video.title}
                {!!playHistory[video.contentId] && <span>再生済み</span>}
              </div>

              <div>
                <span>再生数: {video.viewCounter}</span>
                <span>いいね数: {video.likeCounter}</span>
                <span>マイリスト数: {video.mylistCounter}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HogePageProps> = async () => {
  const event = {
    id: "musyokutoumeisai",
    name: "無色透名祭",
  };

  if (process.env.NODE_ENV === "production") {
    // 静的なJSONファイルを出力
    const result = await getNiconicoVideoInfosByTagName(event.name);

    return {
      props: {
        event: { ...event, ...result },
      },
    };
  }

  const result = await import(
    `../../public/apis/niconico/${event.id}/result.json`
  );

  return {
    props: {
      event: {
        ...event,
        data: result?.data || [],
        totalCount: result?.totalCount || 0,
      },
    },
  };
};

export default Home;
