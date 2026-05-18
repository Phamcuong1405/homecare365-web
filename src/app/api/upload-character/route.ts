import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureDataDirs, readProjectState, writeProjectState } from "@/lib/project-store";

export async function POST(request: Request) {
  await ensureDataDirs();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file ảnh." }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".png";
  const id = randomUUID();
  const filename = `${id}${ext}`;
  const targetPath = path.join(process.cwd(), "data", "characters", filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(targetPath, bytes);

  const state = await readProjectState();
  state.characterImages.push({
    id,
    name: file.name,
    path: `/api/files/characters/${filename}`,
  });
  await writeProjectState(state);

  return NextResponse.json({ ok: true, id });
}
