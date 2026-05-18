import fs from "node:fs/promises";
import path from "node:path";
import { CameraPreset, PosePreset } from "@/lib/types";

const WIDTH = 1280;
const HEIGHT = 720;

const poseHints: Record<PosePreset, string> = {
  front: "standing front facing, neutral confidence pose",
  "left-profile": "standing left profile, chin slightly up",
  "right-profile": "standing right profile, chin slightly up",
  hero: "heroic standing pose, chest open and grounded stance",
  walking: "mid-step walking pose with natural arm swing",
  back: "back view pose with turned head over shoulder",
};

const cameraHints: Record<CameraPreset, string> = {
  "close-up": "close-up framing with face details",
  medium: "medium shot from waist up",
  wide: "wide cinematic frame with full body",
  "low-angle": "low-angle dramatic camera looking up",
  orbit: "angled cinematic frame as if camera orbiting",
};

export async function generatePlaceholderShot(opts: {
  prompt: string;
  pose: PosePreset;
  camera: CameraPreset;
  outputPath: string;
}): Promise<void> {
  const text = [
    opts.prompt.trim() || "Character consistency shot",
    poseHints[opts.pose],
    cameraHints[opts.camera],
    "MVP placeholder frame (replace with model API output).",
  ]
    .join(" | ")
    .replace(/'/g, "\\'");

  const escapedOutput = opts.outputPath.replace(/\\/g, "/");
  const drawtext =
    process.platform === "win32"
      ? `drawtext=fontfile='C\\\\:/Windows/Fonts/arial.ttf':text='${text}':fontcolor=white:fontsize=34:x=40:y=(h-text_h)/2:box=1:boxcolor=black@0.45:boxborderw=20`
      : `drawtext=text='${text}':fontcolor=white:fontsize=34:x=40:y=(h-text_h)/2:box=1:boxcolor=black@0.45:boxborderw=20`;

  const ffmpegArgs = [
    "-f",
    "lavfi",
    "-i",
    `color=c=#101828:s=${WIDTH}x${HEIGHT}:d=1`,
    "-vf",
    drawtext,
    "-frames:v",
    "1",
    escapedOutput,
  ];

  const ffmpegPath = (await import("ffmpeg-static")).default;
  if (!ffmpegPath) {
    throw new Error("FFmpeg binary not found.");
  }

  const { spawn } = await import("node:child_process");
  await fs.mkdir(path.dirname(opts.outputPath), { recursive: true });

  await new Promise<void>((resolve, reject) => {
    const proc = spawn(ffmpegPath, ffmpegArgs);
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || "Failed to generate shot image."));
    });
  });
}
