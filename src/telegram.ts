import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";
import { lastTelegramPostID, setLastTelegramPostID } from "./persistency";

const stringSession = new StringSession(process.env.TELEGRAM_STRING_SESSION);

export const client = new TelegramClient(
  stringSession,
  +process.env.TELEGRAM_API_ID!,
  process.env.TELEGRAM_API_HASH!,
  {
    connectionRetries: 5,
  }
);

await client.start({
  phoneNumber: process.env.TELEGRAM_PHONE_NUMBER!,
  password: async () => process.env.TELEGRAM_PASSWORD!,
  phoneCode: async () => await input.text("code: "),
  onError: (err) => console.log(err),
});
console.log(client.session.save());

export async function getLastMessages(count: number = 50) {
  const messages = await client.getMessages(process.env.TELEGRAM_CHANNEL_ID, {
    limit: count,
  });
  return messages.reverse();
}

export async function getNewMessages() {
  let messages = await getLastMessages();
  const lastPostID = await lastTelegramPostID();
  if (!lastPostID) {
    setLastTelegramPostID(messages[messages.length - 1].id);
    return [];
  }

  messages = messages.filter((m) => m.id > +lastPostID);

  // All media is currently listed as a separate message. These should be grouped
  // somehow so that they can be posted as a single message.
  // Filtered for now until someone gets around to a better implementation here.
  // Notes for the future:
  //  - the message containing text and context comes first, media events follow
  //    immediately after
  //  - the context message also has `media` attached (didn't check )
  messages = messages.filter((m) => m.text.length !== 0);

  return messages;
}

// let messages = await getLastMessages();
// // these are known to contain media (3 photos and one attached as a file (here a "document"))
// messages = messages.filter((m) => m.id <= 647 && m.id >= 641);
// for (const msg of messages) {
//   if (msg.photo) {
//     const path = await client.downloadMedia(msg.media!, {
//       outputFile: `${msg.photo.id}.png`,
//     });
//     console.log(path);
//   }
// }
// process.exit(0);
