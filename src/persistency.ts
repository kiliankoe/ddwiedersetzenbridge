const dateFilename = "lastPostDate";

export async function lastPostDate() {
  const file = Bun.file(dateFilename);
  const str = await file.text();
  return new Date(str.trimEnd());
}

export async function setLastPostDate(str: string) {
  await Bun.write(dateFilename, str);
}
