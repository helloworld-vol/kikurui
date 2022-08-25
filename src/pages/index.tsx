import Image from "next/image";
import { useState } from "react";

import styles from "./index.module.scss";

import type { GetStaticProps, NextPage } from "next";
import type { Festival } from "types";

import { getNiconicoVideoInfosByTagName } from "apis/niconico";
import { getPlayHistories, savePlayHistory } from "apis/store";
import { NiconicoPlayer } from "components/NiconicoPlayer";
import { PageHeader } from "components/PageHeader";
import { useNiconicoPlayerTimer } from "hooks/useNiconicoPlayerTimer";

interface HogePageProps {
  festival: Festival;
}

/** 再生履歴として保存する再生時間の閾値(秒) */
const PLAY_HISTORY_SAVE_THRESHOLD = 30;

const Home: NextPage<HogePageProps> = ({ festival }) => {
  const { videos } = festival;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useNiconicoPlayerTimer({
    onStopTimer: (timer) => {
      if (timer >= PLAY_HISTORY_SAVE_THRESHOLD) {
        const contentId = videos[currentVideoIndex]?.contentId;

        if (contentId) {
          savePlayHistory(festival.id, { timer, contentId });
        }
      }
    },
  });

  return (
    <div>
      <PageHeader />

      <main className={styles.container}>
        <div className={styles.playerContainer}>
          <NiconicoPlayer videoId={videos[currentVideoIndex]?.contentId} />
        </div>

        <div className={styles.playlist}>
          <div>
            <span>進捗度</span>
          </div>

          <div>
            <span>プレイリスト</span>
          </div>

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
                  <div>{video.title}</div>

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
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HogePageProps> = async () => {
  const festival = {
    id: "musyokutoumeisai",
    name: "無色透名祭",
  };

  if (process.env.NODE_ENV === "production") {
    // 静的なJSONファイルを出力
    const result = await getNiconicoVideoInfosByTagName(festival.name);

    return {
      props: {
        festival: {
          ...festival,
          videos: result.data,
          totalCount: 0,
        },
      },
    };
  }

  /* 警告が出るのでコメントアウトしておく */
  // const result = await import(
  //   `../../public/apis/niconico/${event.id}/result.json`
  // );

  return {
    props: {
      festival: {
        ...festival,
        videos: [],
        totalCount: 0,
      },
    },
  };
};

export default Home;
