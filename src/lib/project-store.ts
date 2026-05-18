import fs from "node:fs/promises";
import path from "node:path";
import { ProjectState } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "project.json");

const EMPTY_STATE: ProjectState = {
  characterImages: [],
  shots: [],
};

export async function ensureDataDirs(): Promise<void> {
  await fs.mkdir(path.join(DATA_DIR, "characters"), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "shots"), { recursive: true });
  await fs.mkdir(path.join(DATA_DIR, "renders"), { recursive: true });
}

export async function readProjectState(): Promise<ProjectState> {
  await ensureDataDirs();
  try {
    const file = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(file) as ProjectState;
  } catch {
    return EMPTY_STATE;
  }
}

export async function writeProjectState(state: ProjectState): Promise<void> {
  await ensureDataDirs();
  await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
}
