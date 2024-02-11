import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

const stringSession = new StringSession(process.env.TELEGRAM_STRING_SESSION);

const client = new TelegramClient(
  stringSession,
  +process.env.TELEGRAM_API_ID!,
  process.env.TELEGRAM_API_HASH!,
  {
    connectionRetries: 5,
  }
);
await client.start({
  phoneNumber: process.env.TELEGRAM_PHONE_NUMBER!,
  password: async () => process.env.TELGRAM_PASSWORD!,
  phoneCode: async () => await input.text("code: "),
  onError: (err) => console.log(err),
});
console.log(client.session.save());

const messages = await client.getMessages(process.env.TELEGRAM_CHANNEL_ID, {
  limit: 10,
});
console.log(messages.reverse().map((m) => m.text));

// terrible alternative: scrape web preview

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const html = await Bun.file("src/out.html").text();
// const dom = new JSDOM(html);
// const messages = [
//   ...dom.window.document.querySelectorAll(
//     "div.tgme_widget_message_text:not(a.tgme_widget_message_reply div.tgme_widget_message_text)"
//   ),
// ];

// console.log(
//   messages
//     .map((m) => {
//       let text = m.textContent;
//       text = text.replace(/\n/g, " ").replace(/ +/g, " ").trim();
//       return text;
//     })
//     .join("\n\n")
// );
