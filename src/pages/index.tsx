import Image from "next/image";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

import styles from "./index.module.scss";

import type { NiconicoApiResponseData } from "apis/niconico/types";
import type { GetStaticProps, NextPage } from "next";

import { getNiconicoVideoInfosByTagName } from "apis/niconico";

interface HogePageProps {
  event: {
    id: string;
    name: string;
    totalCount: number;
    data: NiconicoApiResponseData[];
  };
}

const Home: NextPage<HogePageProps> = ({ event }) => {
  const videos = event.data;
  const [currentVideo, setCurrentVideo] =
    useState<NiconicoApiResponseData | null>(videos[0] || null);

  return (
    <div>
      <h1>{event.name}の投稿作品一覧</h1>
      {!!currentVideo && (
        <iframe
          width={600}
          height={480}
          style={{ background: "black" }}
          src={`http://embed.nicovideo.jp/watch/${currentVideo.contentId}`}
        ></iframe>
      )}

      <ul>
        {videos.map((video) => (
          <li key={video.contentId} className={styles.videoItem}>
            <div>
              <Image
                src={video.thumbnailUrl}
                alt="Landscape picture"
                width={130}
                height={100}
              />
            </div>

            <div>
              <a
                href={`https://nico.ms/${video.contentId}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {video.title}
              </a>

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
