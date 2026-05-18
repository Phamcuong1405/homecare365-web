import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { generatePlaceholderShot } from "@/lib/shot-generator";
import { readProjectState, writeProjectState } from "@/lib/project-store";
import { CameraPreset, PosePreset } from "@/lib/types";

interface Body {
  prompt: string;
  pose: PosePreset;
  camera: CameraPreset;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  if (!body.pose || !body.camera) {
    return NextResponse.json({ error: "Thiếu pose/camera." }, { status: 400 });
  }

  const shotId = randomUUID();
  const filename = `${shotId}.png`;
  const outputPath = path.join(process.cwd(), "data", "shots", filename);

  await generatePlaceholderShot({
    prompt: body.prompt,
    pose: body.pose,
    camera: body.camera,
    outputPath,
  });

  const state = await readProjectState();
  state.shots.push({
    id: shotId,
    prompt: body.prompt,
    pose: body.pose,
    camera: body.camera,
    imagePath: `/api/files/shots/${filename}`,
    durationSec: 2,
    createdAt: new Date().toISOString(),
  });
  await writeProjectState(state);

  return NextResponse.json({ ok: true, shotId });
}
