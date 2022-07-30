import Image from "next/image";
import useSWRInfinite from "swr/infinite";

import styles from "./index.module.scss";

import type { NiconicoApiResponseData } from "apis/niconico/types";
import type { GetStaticProps, NextPage } from "next";

import { generateNiconicoVideoInfosByTag } from "apis/niconico";
import { NICONICO_VIDEOS_PER_PAGE } from "apis/niconico/variables";

interface HogePageProps {
  event: {
    id: string;
    name: string;
  };
}

const Home: NextPage<HogePageProps> = ({ event }) => {
  const getKey = (offset: number, preData: NiconicoApiResponseData[]) => {
    if (
      preData &&
      (!preData.length || preData.length < NICONICO_VIDEOS_PER_PAGE)
    ) {
      return null;
    }

    console.log({ offset, preData });

    return `/apis/niconico/${event.id}/videos/${offset}.json`;
  };

  const fetcher = (path: string): Promise<NiconicoApiResponseData[]> => {
    return fetch(path).then((r) => r.json());
  };

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  const isLoading = !data;
  const videos = data ? data.flat() : [];

  return (
    <div>
      <h1>{event.name}の投稿作品一覧</h1>

      <ul>
        {isLoading && <p>Loading ...</p>}

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

      <button onClick={() => setSize(size + 1)}>更に読み込む</button>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HogePageProps> = async () => {
  const event = {
    id: "musyokutoumeisai",
    name: "無色透名祭",
  };

  // 不用意にリクエストするのを防ぐためにビルド時のみリクエストする
  if (process.env.NODE_ENV === "production") {
    // 静的なJSONファイルを出力
    await generateNiconicoVideoInfosByTag(event.id, event.name);
  } else {
    // 開発環境の場合は `yarn generate:nico` を実行して生成する
  }

  return {
    props: {
      event,
    },
  };
};

export default Home;
