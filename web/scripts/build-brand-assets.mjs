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
const croppedMark = await sharp(trimmedLogo)
  .extract({ left: 0, top: 0, width: markWidth, height: info.height })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// The source wordmark begins immediately after the red "ti" mark. Remove
// neutral/black pixels from that crop while preserving red antialiased edges.
for (let index = 0; index < croppedMark.data.length; index += 4) {
  const red = croppedMark.data[index];
  const green = croppedMark.data[index + 1];
  const blue = croppedMark.data[index + 2];
  const alpha = croppedMark.data[index + 3];
  const saturation = red - Math.max(green, blue);
  if (alpha === 0 || red < 35 || saturation < 18) {
    croppedMark.data[index + 3] = 0;
  }
}

const mark = await sharp(croppedMark.data, {
  raw: {
    width: croppedMark.info.width,
    height: croppedMark.info.height,
    channels: 4,
  },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp(trimmedLogo)
  .resize({ width: 1200, withoutEnlargement: false })
  .webp({ quality: 94 })
  .toFile(fileURLToPath(new URL("titalks-wordmark.webp", publicDir)));

await sharp(mark)
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 94 })
  .toFile(fileURLToPath(new URL("titalks-mark.webp", publicDir)));

for (const size of [32, 180, 192, 512]) {
  await sharp(mark)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(fileURLToPath(new URL(`titalks-icon-${size}.png`, publicDir)));
}
