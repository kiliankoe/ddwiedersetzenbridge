import { createWorker } from "tesseract.js";
import type { Media } from "./media";

async function ocr(url: string) {
  const worker = await createWorker("deu");
  const ret = await worker.recognize(url);
  await worker.terminate();
  return ret.data.text;
}

export async function annotateMedia(images: string[]): Promise<Media[]> {
  return await Promise.all(
    images.map(async (url) => {
      return {
        originalURL: url,
        description: await ocr(url),
      };
    })
  );
}
