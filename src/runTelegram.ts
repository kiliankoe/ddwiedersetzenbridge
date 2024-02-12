import { postToMastodon } from "./masto";
import { setLastTelegramPostID } from "./persistency";
import { getNewMessages } from "./telegram";

const messages = await getNewMessages();
if (messages.length === 0) {
  console.log("no new telegram messages");
  process.exit(0);
}
for (const m of messages) {
  console.log(m.text);
  const status = await postToMastodon({
    visibility: "public",
    status: m.text,
  });
  console.log(`posted ${status.url}`);

  await new Promise((resolve) => setTimeout(resolve, 500));
}

const latest = messages[messages.length - 1];
console.log(latest.id, latest.text);
setLastTelegramPostID(latest.id);
process.exit(0);
