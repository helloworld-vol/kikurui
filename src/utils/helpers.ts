/** 渡された秒数(ms)待つ関数 */
export const wait = (time: number) => new Promise((r) => setTimeout(r, time));
