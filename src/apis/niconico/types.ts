/**
 * ニコニコ動画検索APIの検索結果
 */
export type NiconicoApiResponseData = {
  /**
   * コンテンツID。https://nico.ms/ の後に連結することでコンテンツへのURLになります。
   */
  contentId: string;

  /** タイトル */
  title: string;

  /** コンテンツの説明文 */
  description: string;

  /** ユーザー投稿動画の場合、投稿者のユーザーID */
  userId?: number | null;

  /** チャンネル動画の場合、チャンネルID */
  channelId?: number | null;

  /** 再生数 */
  viewCounter: number;

  /** マイリスト数またはお気に入り数。 */
  mylistCounter: number;

  /** いいね！数 */
  likeCounter: number;

  /** 再生時間(秒) */
  lengthSeconds: number;

  /** サムネイルのURL */
  thumbnailUrl: string;

  /** コンテンツの投稿時間(ISO8601形式) */
  startTime: string;

  /** コメント数 */
  commentCounter?: number;

  /** タグ(空白区切り) */
  tags: string;
};

/**
 * ニコニコ動画検索APIのレスポンス型
 */
export type NiconicoApiResponse = {
  meta: {
    id: string;
    status: number;
    totalCount?: number;
    errorCode?: string;
    errorMessage?: string;
  };
  data: NiconicoApiResponseData[];
};

/**
 * ニコニコの検索APIのクエリ
 * @from https://site.nicovideo.jp/search-api-docs/snapshot
 */
export type NiconicoSearchQuery = {
  /**
   * 検索キーワード
   * @example "ゲーム"
   */
  q: string;

  /**
   * 検索対象のフィールド（複数可、カンマ区切り）です。キーワード検索の場合、title,description,tagsを指定してください。タグ検索（キーワードに完全一致するタグがあるコンテンツをヒット）の場合、tagsExactを指定してください。キーワード無し検索の場合は省略できます。
   * @example "title,description,tags"
   */
  targets: string;

  /** レスポンスに含みたいヒットしたコンテンツのフィールドです。 */
  fields?: string;

  /** 検索結果をフィルタの条件にマッチするコンテンツだけに絞ります。 */
  filters?: string;

  /** OR や AND の入れ子など複雑なフィルター条件を使う場合のみに使用します。 */
  jsonFilter?: string;

  /**
   * ソート順をソートの方向の記号とフィールド名を連結したもので指定します。ソートの方向は昇順または降順かを'+'か'-'で指定し、ない場合はデフォルトとして'-'となります。
   * @example "-viewCounter"
   */
  _sort: string;

  /**
   * 返ってくるコンテンツの取得オフセット。最大:100,000
   * @default 0
   */
  _offset?: number;

  /**
   * 返ってくるコンテンツの最大数。最大:100
   * @default 10
   */
  _limit?: number;

  /**
   * サービスまたはアプリケーション名。最大:40文字
   */
  // _context: string;
};

/**
 * @example
 * {
 *   code: "possibly_deleted_video",
 *   message: "この動画は表示できません\n現在視聴できないか、削除された可能性があります",
 *   raw: undefined
 * }
 */
export type NiconicoEmbedPlayerError = {
  code: string;
  message: string;
  raw: any | undefined;
};

/**
 * ニコニコ動画の埋め込みプレイヤーのイベントをまとめた型
 */
export type NiconicoEmbedPlayerEvents = {
  loadComplete: {
    playerId: string;
    eventName: "loadComplete";
    data: {
      videoInfo: {
        commentCount: number;
        description: string;
        lengthInSeconds: number;
        mylistCount: number;
        postedAt: Date;
        thumbnailUrl: string;
        title: string;
        videoId: string;
        viewCount: number;
        watchId: number;
      };
    };
  };

  playerStatusChange: {
    playerId: string;
    eventName: "playerStatusChange";
    data: {
      playerStatus: number;
    };
  };

  statusChange: {
    playerId: string;
    eventName: "statusChange";
    data: {
      playerStatus: number;
      seekStatus: number;
    };
  };

  play: {
    eventName: "play";
    playerId: string;
    sourceConnectorType: number;
  };

  pause: {
    eventName: "pause";
    playerId: string;
    sourceConnectorType: number;
  };

  mute: {
    eventName: "mute";
    playerId: string;
    sourceConnectorType: number;
    data: {
      mute: boolean;
    };
  };

  seek: {
    eventName: "seek";
    playerId: string;
    sourceConnectorType: number;
    data: {
      time: number;
    };
  };

  volumeChange: {
    eventName: "volumeChange";
    playerId: string;
    sourceConnectorType: number;
    data: {
      volume: number;
    };
  };
};

/**
 * ニコニコ動画の埋め込みプレイヤーイベントの Union 型
 */
export type NiconicoEmbedPlayerEvent =
  NiconicoEmbedPlayerEvents[keyof NiconicoEmbedPlayerEvents];
