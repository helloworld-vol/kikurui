import clsx from "clsx";
import Image from "next/image";

import styles from "./PlayList.module.scss";

import StarSolidSVG from "assets/svg/star-solid.svg";
import StarSVG from "assets/svg/star.svg";
import { Video } from "types";

interface PlayListProps {
  videos: Video[];
  favoriteVideoIds: string[];
  onSelected: (video: Video, index: number) => void;
  onFavorited: (video: Video) => void;
}

export const PlayList: React.FC<PlayListProps> = ({
  videos,
  favoriteVideoIds,
  onSelected,
  onFavorited,
}) => {
  return (
    <div className={styles.playlist}>
      <ul>
        {videos.map((video, i) => (
          <li
            key={video.contentId}
            className={styles.playlistItem}
            onClick={() => onSelected(video, i)}
          >
            <div className={styles.thumbnail}>
              <Image src={`${video.thumbnailUrl}`} alt="" layout="fill" />
            </div>

            <div className={styles.videoInfo}>
              <div className={styles.videoTitle}>{video.title}</div>
            </div>

            <button
              className={styles.favoButton}
              onClick={() => onFavorited(video)}
            >
              {favoriteVideoIds.includes(video.contentId) ? (
                <StarSolidSVG
                  width={24}
                  height={24}
                  className={styles.favorited}
                />
              ) : (
                <StarSVG width={24} height={24} />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
