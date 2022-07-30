import { generateNiconicoVideoInfosByTag } from "../src/apis/niconico";

generateNiconicoVideoInfosByTag("musyokutoumeisai", "無色透名祭")
  .then(() => console.log("完了しました"))
  .catch(console.error);
