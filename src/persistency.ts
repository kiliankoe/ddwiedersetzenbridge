const dateFilename = "lastPostDate";

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
