import fs from "fs/promises";

import { getNiconicoVideoInfosByTagName } from "../src/apis/niconico";

(async () => {
  const id = "musyokutoumeisai";
  const folder = `./public/apis/niconico/${id}`;

  const result = await getNiconicoVideoInfosByTagName("無色透名祭");

  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(`${folder}/result.json`, JSON.stringify(result));

  console.log("処理が完了しました");
  console.log(`${result.totalCount}件のデータを取得しました`);
})();
