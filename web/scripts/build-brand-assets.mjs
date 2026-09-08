import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const source = new URL("titalks-logo-source.png", publicDir);
const outputs = [
  "titalks-wordmark.webp",
  "titalks-mark.webp",
  "titalks-icon-32.png",
  "titalks-icon-180.png",
  "titalks-icon-192.png",
  "titalks-icon-512.png",
];

if (!existsSync(source)) throw new Error("Missing titalks-logo-source.png");
for (const output of outputs) {
  const path = fileURLToPath(new URL(output, publicDir));
  if (existsSync(path)) rmSync(path);
}

const { data: trimmedLogo, info } = await sharp(fileURLToPath(source))
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer({ resolveWithObject: true });
const markWidth = Math.round(info.width * 0.275);
const mark = await sharp(trimmedLogo)
  .extract({ left: 0, top: 0, width: markWidth, height: info.height })
  .png()
  .toBuffer();

await sharp(trimmedLogo)
  .resize({ width: 1200, withoutEnlargement: false })
  .webp({ quality: 94 })
  .toFile(fileURLToPath(new URL("titalks-wordmark.webp", publicDir)));

await sharp(mark)
  .resize(512, 512, { fit: "contain", background: "#050505" })
  .webp({ quality: 94 })
  .toFile(fileURLToPath(new URL("titalks-mark.webp", publicDir)));

for (const size of [32, 180, 192, 512]) {
  await sharp(mark)
    .resize(size, size, { fit: "contain", background: "#050505" })
    .png()
    .toFile(fileURLToPath(new URL(`titalks-icon-${size}.png`, publicDir)));
}
