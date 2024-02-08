import { postToMastodon, uploadMedia } from "./masto";
import { annotateMedia as annotatedMedia } from "./ocr";
import { extractImages, fetchTweets } from "./twitter";
import { lastPostDate, setLastPostDate } from "./persistency";

const lastDate = await lastPostDate();
const feedItems = await fetchTweets();

const newItems = feedItems.filter((item) => new Date(item.isoDate!) > lastDate);
console.log(newItems.length > 0 ? newItems : "no new items");

for (const item of newItems) {
  let post;

  let images = extractImages(item);
  if (images.length > 0) {
    images = await annotatedMedia(images);
    const attachmentIds = await Promise.all(
      images.map(async (image) => {
        return await uploadMedia(image);
      })
    );
    post = {
      status: `${item.title}\n${item.link}`,
      media_ids: attachmentIds,
    };
  } else {
    post = {
      status: `${item.title}\n${item.link}`,
    };
  }

  const status = await postToMastodon({
    visibility: "public",
    ...post,
  });
  console.log(`posted ${status.url}`);

  // in case there's multiple, let's be nice to the API
  await new Promise((resolve) => setTimeout(resolve, 500));
}

const latest = feedItems[0];
setLastPostDate(latest.isoDate!);
