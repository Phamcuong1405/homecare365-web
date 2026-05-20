import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pngPath = join(root, "public", "brand", "homecare365-logo.png");

const input = await readFile(pngPath);
const optimized = await sharp(input)
  .resize(1400, null, { fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, quality: 80 })
  .toBuffer();

await writeFile(pngPath, optimized);
console.log(`Optimized ${pngPath}: ${input.length} → ${optimized.length} bytes`);
