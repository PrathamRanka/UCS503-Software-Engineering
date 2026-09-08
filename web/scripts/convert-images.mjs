import { readdir, rm } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const imagesDirectory = fileURLToPath(new URL('../public/images/', import.meta.url))

for (const name of await readdir(imagesDirectory)) {
  if (!['.jpg', '.jpeg', '.png'].includes(extname(name).toLowerCase())) continue
  const source = join(imagesDirectory, name)
  const destination = source.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  await sharp(source).webp({ quality: 84, effort: 5 }).toFile(destination)
  await rm(source)
}
