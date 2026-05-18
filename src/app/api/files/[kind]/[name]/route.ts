import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowedKinds = new Set(["characters", "shots", "renders"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ kind: string; name: string }> },
) {
  const { kind, name } = await context.params;
  if (!allowedKinds.has(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), "data", kind, name);
  try {
    const buffer = await fs.readFile(fullPath);
    const ext = path.extname(name).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" : ext === ".mp4" ? "video/mp4" : "application/octet-stream";
    return new NextResponse(buffer, {
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
