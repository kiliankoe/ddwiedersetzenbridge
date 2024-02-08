import Parser from "rss-parser";

// thx bun
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export async function fetchTweets(): Promise<Parser.Item[]> {
  // 🤞 that nitter never dies. twiiit is the best thing since sliced bread btw.
  const feedURL = "https://twiiit.com/ddwiedersetzen/rss";

  const parser = new Parser();
  const feed = await parser.parseURL(feedURL);
  return feed.items;
}

export function guid(feedItem: any) {
  let regex = /status\/(\d+)/;
  return feedItem.guid.match(regex)[1];
}

export function extractImages(feedItem: any) {
  const dom = new JSDOM(feedItem.content);
  const images = [...dom.window.document.querySelectorAll("img")].map(
    (img) => img.src
  );
  return images;
}
