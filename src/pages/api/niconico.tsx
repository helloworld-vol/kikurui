import { generateNiconicoVideoInfos } from "apis/niconico";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(404).json({ message: "not found" });

  await generateNiconicoVideoInfos("musyokutoumeisai", {
    q: "無色透名祭",
    targets: "tags",
    fields:
      "contentId,title,description,userId,channelId,viewCounter,mylistCounter,likeCounter,lengthSeconds,thumbnailUrl,startTime,tags",
    _sort: "+startTime",
  });

  res.status(200).json({ success: true });
};
