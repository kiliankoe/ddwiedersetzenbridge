import { createRestAPIClient } from "masto";
import type { Media } from "./media";

interface MastoPost {
  visibility: "public" | "unlisted" | "private" | "direct";
  status: string;
  media_ids?: string[];
}

const masto = createRestAPIClient({
  url: process.env.MASTO_SERVER_URL!,
  accessToken: process.env.MASTO_ACCESS_TOKEN!,
});

export async function uploadMedia(media: Media) {
  console.log(`attempting to upload ${media.originalURL}`);
  const remoteFile = await fetch(media.originalURL);
  const blob = await remoteFile.blob();
  const file = new File([blob], media.originalURL.slice(-15), {
    type: blob.type,
  });
  const attachment = await masto.v2.media.create({
    file: file,
    description: media.description,
  });
  return attachment.id;
}

export async function postToMastodon(post: MastoPost) {
  return masto.v1.statuses.create(post);
}
