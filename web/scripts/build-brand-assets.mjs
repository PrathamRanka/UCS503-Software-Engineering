import { existsSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = new URL("../public/", import.meta.url);
const original = new URL("WhatsApp Image 2026-09-07 at 09.56.30.jpeg", publicDir);
const source = new URL("titalks-brand-source.jpeg", publicDir);

if (existsSync(original)) renameSync(original, source);
if (!existsSync(source)) throw new Error("Missing titalks brand source image");

const sourcePath = fileURLToPath(source);

await sharp(sourcePath)
  .extract({ left: 120, top: 190, width: 1340, height: 560 })
  .resize({ width: 1200, withoutEnlargement: false })
  .webp({ quality: 92 })
  .toFile(fileURLToPath(new URL("titalks-wordmark.webp", publicDir)));

await sharp(sourcePath)
  .extract({ left: 130, top: 190, width: 390, height: 560 })
  .resize(512, 512, { fit: "contain", background: "#000000" })
  .webp({ quality: 92 })
  .toFile(fileURLToPath(new URL("titalks-mark.webp", publicDir)));

await sharp(sourcePath)
  .extract({ left: 130, top: 190, width: 390, height: 560 })
  .resize(192, 192, { fit: "contain", background: "#000000" })
  .png()
  .toFile(fileURLToPath(new URL("titalks-icon-192.png", publicDir)));

await sharp(sourcePath)
  .extract({ left: 130, top: 190, width: 390, height: 560 })
  .resize(512, 512, { fit: "contain", background: "#000000" })
  .png()
  .toFile(fileURLToPath(new URL("titalks-icon-512.png", publicDir)));
