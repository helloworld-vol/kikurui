import Image from "next/image";
import { useState } from "react";

import styles from "./index.module.scss";

import type { GetStaticProps, NextPage } from "next";
import type { Festival } from "types";

import { getNiconicoVideoInfosByTagName } from "apis/niconico";
import { saveFavoriteVideo, savePlayHistory } from "apis/store";
import { NiconicoPlayer } from "components/NiconicoPlayer";
import { PageHeader } from "components/PageHeader";
import { PlayList } from "components/PlayList";
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
        // サンプルデータ
        videos: [
          {
            contentId: "so40837119",
            title: "ひとりぼっち／初音ミク",
            description:
              "【無色透名祭】参加作品です。<br>https://site.nicovideo.jp/mushokutomeisai/<br>",
            viewCounter: 6160,
            mylistCounter: 54,
            likeCounter: 206,
            lengthSeconds: 150,
            thumbnailUrl:
              "https://nicovideo.cdn.nimg.jp/thumbnails/40837119/40837119.39201325",
            startTime: "2022-07-28T18:00:00+09:00",
            tags: "VOCALOID ひとりぼっち ミクオリジナル曲 優しいミクうた 初音ミク 無色透名祭",
            userId: null,
            channelId: 2648319,
          },
          {
            contentId: "so40836614",
            title: "ラビリンス / 初音ミク",
            description:
              "【無色透名祭】参加作品です。<br>https://site.nicovideo.jp/mushokutomeisai/<br>",
            viewCounter: 11816,
            mylistCounter: 651,
            likeCounter: 1133,
            lengthSeconds: 198,
            thumbnailUrl:
              "https://nicovideo.cdn.nimg.jp/thumbnails/40836614/40836614.91772428",
            startTime: "2022-07-28T18:00:00+09:00",
            tags: "VOCALOID 初音ミクオリジナル曲 初音ミク オリジナル曲 無色透名祭 良調教 ラビリンス 疾走感 ミクオリジナル曲 VOCAROCK もっと評価されるべき",
            userId: null,
            channelId: 2648319,
          },
          {
            contentId: "so40820450",
            title: "ミラーミラー / 可不",
            description:
              "【無色透名祭】参加作品です。<br>https://site.nicovideo.jp/mushokutomeisai/<br>",
            viewCounter: 3851,
            mylistCounter: 276,
            likeCounter: 322,
            lengthSeconds: 158,
            thumbnailUrl:
              "https://nicovideo.cdn.nimg.jp/thumbnails/40820450/40820450.42883966",
            startTime: "2022-07-28T18:00:00+09:00",
            tags: "CeVIOオリジナル曲 cevio新曲リンク VOCALOID VOCAROCK ボカロオリジナル曲 リリースカットピアノ 可不 可不オリジナル曲 無色透名祭",
            userId: null,
            channelId: 2648319,
          },
        ],
        totalCount: 0,
      },
    },
  };
};

export default Home;
