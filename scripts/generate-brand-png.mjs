import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "public", "brand");
const svgPath = join(brandDir, "homecare365-logo.svg");
const pngPath = join(brandDir, "homecare365-logo.png");

const svg = await readFile(svgPath);
const png = await sharp(svg, { density: 320 })
  .resize(1600, 1040, { fit: "inside", withoutEnlargement: false })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(pngPath, png);
console.log(`Wrote ${pngPath} (${png.length} bytes)`);
