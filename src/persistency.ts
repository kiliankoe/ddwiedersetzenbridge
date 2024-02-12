const dateFilename = "lastPostDate";
const telegramFilename = "lastTelegramPost";

export async function lastPostDate() {
  const file = Bun.file(dateFilename);
  if (file.size === 0) {
    return new Date();
  }
  const str = await file.text();
  return new Date(str.trimEnd());
}

export async function setLastPostDate(str: string) {
  await Bun.write(dateFilename, str);
}

export async function lastTelegramPostID() {
  const file = Bun.file(telegramFilename);
  if (file.size === 0) {
    return undefined;
  }
  return (await file.text()).trim();
}

export async function setLastTelegramPostID(id: number) {
  await Bun.write(telegramFilename, `${id}`);
}
