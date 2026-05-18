import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { NextResponse } from "next/server";
import ffmpegPath from "ffmpeg-static";
import { readProjectState } from "@/lib/project-store";

async function runFfmpeg(args: string[]) {
  if (!ffmpegPath) throw new Error("FFmpeg binary not found.");
  const resolvedFfmpegPath = ffmpegPath;
  await new Promise<void>((resolve, reject) => {
    const proc = spawn(resolvedFfmpegPath, args);
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || "FFmpeg failed"));
    });
  });
}

export async function POST() {
  const state = await readProjectState();
  if (state.shots.length === 0) {
    return NextResponse.json({ error: "Chưa có shot để export." }, { status: 400 });
  }

  const tempDir = path.join(process.cwd(), "data", "renders", "tmp");
  await fs.mkdir(tempDir, { recursive: true });
  const listFile = path.join(tempDir, `concat-${randomUUID()}.txt`);

  const clipPaths: string[] = [];
  for (let i = 0; i < state.shots.length; i += 1) {
    const shot = state.shots[i];
    const shotFilename = shot.imagePath.split("/").pop();
    if (!shotFilename) continue;
    const inputImage = path.join(process.cwd(), "data", "shots", shotFilename);
    const clipPath = path.join(tempDir, `clip-${i}-${randomUUID()}.mp4`);
    clipPaths.push(clipPath);

    await runFfmpeg([
      "-loop",
      "1",
      "-t",
      String(shot.durationSec),
      "-i",
      inputImage,
      "-vf",
      "fps=30,format=yuv420p",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-y",
      clipPath,
    ]);
  }

  const concatBody = clipPaths.map((clip) => `file '${clip.replace(/\\/g, "/")}'`).join("\n");
  await fs.writeFile(listFile, concatBody, "utf-8");

  const renderId = `${randomUUID()}.mp4`;
  const outputVideo = path.join(process.cwd(), "data", "renders", renderId);
  await runFfmpeg([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listFile,
    "-c",
    "copy",
    "-y",
    outputVideo,
  ]);

  return NextResponse.json({
    ok: true,
    videoPath: `/api/files/renders/${renderId}`,
  });
}
