import { postToMastodon, uploadMedia } from "./masto";
import { annotateMedia } from "./ocr";
import { extractImages, fetchTweets } from "./twitter";
import { lastPostDate, setLastPostDate } from "./persistency";

const lastDate = await lastPostDate();
const feedItems = await fetchTweets();

const newItems = feedItems.filter((item) => new Date(item.isoDate!) > lastDate);
console.log(newItems.length > 0 ? newItems : "no new items");

for (const item of newItems) {
  let attachmentIds = undefined;

  const images = extractImages(item);
  if (images.length > 0) {
    const media = await annotateMedia(images);
    attachmentIds = await uploadMedia(media);
  }

  const status = await postToMastodon({
    visibility: "public",
    status: `${item.title}\n${item.link}`,
    media_ids: attachmentIds,
  });
  console.log(`posted ${status.url}`);

  // in case there's multiple, let's be nice to the API
  await new Promise((resolve) => setTimeout(resolve, 500));
}

const latest = feedItems[0];
setLastPostDate(latest.isoDate!);
const now = new Date().toISOString();
console.log(`${now}: done, last post date set to ${latest.isoDate}`);
