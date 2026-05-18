"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { CameraPreset, PosePreset, ProjectState } from "@/lib/types";

const poseOptions: PosePreset[] = ["front", "left-profile", "right-profile", "hero", "walking", "back"];
const cameraOptions: CameraPreset[] = ["close-up", "medium", "wide", "low-angle", "orbit"];

export default function StudioPage() {
  const [state, setState] = useState<ProjectState>({ characterImages: [], shots: [] });
  const [prompt, setPrompt] = useState("anime female character, consistent identity, cinematic lighting");
  const [pose, setPose] = useState<PosePreset>("front");
  const [camera, setCamera] = useState<CameraPreset>("medium");
  const [busy, setBusy] = useState(false);
  const [videoPath, setVideoPath] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/project", { cache: "no-store" })
      .then((res) => res.json() as Promise<ProjectState>)
      .then((data) => {
        if (active) setState(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  async function loadProject() {
    const res = await fetch("/api/project", { cache: "no-store" });
    const data = (await res.json()) as ProjectState;
    setState(data);
  }

  async function onUploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("character-file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setBusy(true);
    await fetch("/api/upload-character", { method: "POST", body: formData });
    setBusy(false);
    form.reset();
    await loadProject();
  }

  async function onGenerateShot() {
    setBusy(true);
    setVideoPath("");
    await fetch("/api/generate-shot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, pose, camera }),
    });
    setBusy(false);
    await loadProject();
  }

  async function onExportVideo() {
    setBusy(true);
    const res = await fetch("/api/export-video", { method: "POST" });
    const data = (await res.json()) as { videoPath?: string };
    setVideoPath(data.videoPath ?? "");
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <header className="mx-auto mb-6 flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-white hover:text-indigo-300">
          ← HomeCare365
        </Link>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">Studio</span>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h1 className="text-xl font-semibold">Character Video Studio</h1>
          <p className="text-sm text-slate-400">
            MVP tạo nhiều góc quay và dáng đứng đồng nhất nhân vật theo ảnh mẫu.
          </p>

          <form onSubmit={onUploadFile} className="space-y-2">
            <label className="text-sm">Upload ảnh nhân vật mẫu</label>
            <input
              type="file"
              name="character-file"
              accept="image/*"
              className="block w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              Tải ảnh lên
            </button>
          </form>

          <div className="space-y-2">
            <label className="text-sm">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm">
              Pose
              <select
                value={pose}
                onChange={(e) => setPose(e.target.value as PosePreset)}
                className="mt-1 block w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm"
              >
                {poseOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Camera
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value as CameraPreset)}
                className="mt-1 block w-full rounded border border-slate-700 bg-slate-950 p-2 text-sm"
              >
                {cameraOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onGenerateShot}
              disabled={busy}
              className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              Generate shot
            </button>
            <button
              onClick={onExportVideo}
              disabled={busy || state.shots.length === 0}
              className="rounded bg-purple-600 px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              Export MP4
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4 lg:col-span-2">
          <h2 className="font-semibold">Character References ({state.characterImages.length})</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {state.characterImages.map((img) => (
              <Image
                key={img.id}
                src={img.path}
                alt={img.name}
                width={400}
                height={250}
                className="h-40 w-full rounded object-cover"
              />
            ))}
          </div>

          <h2 className="pt-4 font-semibold">Timeline Shots ({state.shots.length})</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {state.shots.map((shot) => (
              <article key={shot.id} className="rounded border border-slate-700 p-2">
                <Image
                  src={shot.imagePath}
                  alt={shot.prompt}
                  width={400}
                  height={220}
                  className="mb-2 h-36 w-full rounded object-cover"
                />
                <p className="text-xs text-slate-300">{shot.prompt}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {shot.pose} • {shot.camera} • {shot.durationSec}s
                </p>
              </article>
            ))}
          </div>

          {videoPath ? (
            <div className="pt-4">
              <h3 className="mb-2 font-semibold">Rendered Video</h3>
              <video src={videoPath} controls className="w-full rounded" />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
