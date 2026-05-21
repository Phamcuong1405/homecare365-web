/**
 * Tạo icon & splash cho Android/iOS từ logo web
 */
import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = join(root, "..");
const brandDir = join(webRoot, "public", "brand");
const wwwDir = join(root, "www");
const resourcesDir = join(root, "resources");

const BRAND_BLUE = "#0047ab";

async function pickSource() {
  const png = join(brandDir, "homecare365-logo.png");
  const svg = join(brandDir, "homecare365-logo.svg");
  try {
    await access(png, constants.R_OK);
    return png;
  } catch {
    return svg;
  }
}

async function writeSquareIcon(src, outPath, size) {
  const img = sharp(src, { density: 320 });
  const meta = await img.metadata();
  const buffer = await img
    .resize(size, size, {
      fit: "contain",
      background: BRAND_BLUE,
    })
    .png()
    .toBuffer();
  await writeFile(outPath, buffer);
  return buffer;
}

async function writeSplash(src, outPath) {
  const w = 2732;
  const h = 2732;
  const logoSize = Math.round(w * 0.42);
  const logo = await sharp(src, { density: 320 })
    .resize(logoSize, logoSize, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  const src = await pickSource();
  await mkdir(wwwDir, { recursive: true });
  await mkdir(resourcesDir, { recursive: true });

  const icon1024 = join(resourcesDir, "icon.png");
  const splash = join(resourcesDir, "splash.png");
  const wwwIcon = join(wwwDir, "icon.png");

  await writeSquareIcon(src, icon1024, 1024);
  await writeSquareIcon(src, wwwIcon, 512);
  await writeSplash(src, splash);

  console.log(`Wrote ${icon1024}`);
  console.log(`Wrote ${splash}`);
  console.log(`Wrote ${wwwIcon}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
