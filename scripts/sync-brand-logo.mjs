/**
 * Đồng bộ logo từ thư mục thiết kế (Windows) vào public/brand/
 * Chạy: node scripts/sync-brand-logo.mjs
 */
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE = "E:\\EDIT VIDEO\\WEB\\55597f9f-0ec7-4ce9-8f70-b2fcf2e06349.png";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "brand", "homecare365-logo.png");

await copyFile(SOURCE, out + ".tmp");
const input = await readFile(out + ".tmp");
const optimized = await sharp(input)
  .resize(1800, null, { fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 8, quality: 92 })
  .toBuffer();
await writeFile(out, optimized);
console.log(`Synced logo → ${out} (${optimized.length} bytes)`);
