/**
 * 渡された秒数(ms)待つ関数
 */
export const wait = (time: number) => new Promise((r) => setTimeout(r, time));

/**
 * localStorageに保存されている値を取得する
 */
export const getLocalStorageValue = (key: string): unknown => {
  try {
    const data = localStorage.getItem(key) || "";
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};
