export type PosePreset =
  | "front"
  | "left-profile"
  | "right-profile"
  | "hero"
  | "walking"
  | "back";

export type CameraPreset = "close-up" | "medium" | "wide" | "low-angle" | "orbit";

export interface CharacterImage {
  id: string;
  name: string;
  path: string;
}

export interface Shot {
  id: string;
  prompt: string;
  pose: PosePreset;
  camera: CameraPreset;
  imagePath: string;
  durationSec: number;
  createdAt: string;
}

export interface ProjectState {
  characterImages: CharacterImage[];
  shots: Shot[];
}
