import useSWR from "swr";

import { Festival, FestivalMeta, Video } from "types";

interface FetchResult {
  data: Video[];
  totalCount: number;
}

export const useFetchFestival = (festival: FestivalMeta) => {
  const { data, error } = useSWR<FetchResult>(`${festival.id}/videos`, () => {
    return fetch(`/apis/niconico/${festival.id}/videos.json`).then((r) =>
      r.json()
    );
  });

  if (error) console.error(error);

  return {
    isError: !!error,
    videos: data?.data,
    totalCount: data?.totalCount || 0,
  };
};
