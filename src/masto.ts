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

async function uploadSingleMedia(media: Media): Promise<string> {
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

export async function uploadMedia(media: Media[]): Promise<string[]> {
  return await Promise.all(media.map((m) => uploadSingleMedia(m)));
}

export async function postToMastodon(post: MastoPost) {
  if (post.status.length > 1000) {
    post.status = post.status.slice(0, 994) + " [...]";
  }
  return masto.v1.statuses.create(post);
}
