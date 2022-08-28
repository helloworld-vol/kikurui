import { useState } from "react";
import sanitizeHtml from "sanitize-html";

import styles from "./index.module.scss";

import type { GetStaticProps, NextPage } from "next";
import type { Festival, FestivalMeta, Video } from "types";

import { saveFavoriteVideo, savePlayHistory } from "apis/store";
import { NiconicoPlayer } from "components/NiconicoPlayer";
import { PageHeader } from "components/PageHeader";
import { PlayList } from "components/PlayList";
import { useFetchFestival } from "hooks/useFetchFestival";
import { useNiconicoPlayerTimer } from "hooks/useNiconicoPlayerTimer";

/** 再生履歴として保存する再生時間の閾値(秒) */
const PLAY_HISTORY_SAVE_THRESHOLD = 30;

interface PlayerProps {
  festival: Festival;
}

const Player: React.FC<PlayerProps> = ({ festival }) => {
  const { videos } = festival;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideo: Video | undefined = videos[currentVideoIndex];

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
          <NiconicoPlayer
            playerId={festival.id}
            videoId={currentVideo?.contentId}
          />

          <div className={styles.videoDetails}>
            <h2 className={styles.videoTitle}>
              {currentVideo?.title || "----"}
            </h2>

            <p
              className={styles.videoDescription}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(currentVideo?.description || ""),
              }}
            ></p>
          </div>
        </div>

        <div className={styles.sideMenu}>
          <div>
            <header className={styles.sideMenuHeader}>
              <span>プレイリスト</span>
            </header>

            <PlayList
              videos={videos}
              favoriteVideoIds={[]}
              onSelected={(_, index) => setCurrentVideoIndex(index)}
              onFavorited={(video) => saveFavoriteVideo(festival.id, video)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

interface HogePageProps {
  festival: FestivalMeta;
}

const Home: NextPage<HogePageProps> = ({ festival }) => {
  const { videos, totalCount, isError } = useFetchFestival(festival);

  if (isError) return <p>Error !!!!</p>;
  if (!videos) return <p>Loading ....</p>;

  return <Player festival={{ ...festival, videos, totalCount }} />;
};

export const getStaticProps: GetStaticProps<HogePageProps> = async () => {
  return {
    props: {
      festival: {
        id: "musyokutoumeisai",
        name: "無色透名祭",
      },
    },
  };
};

export default Home;
