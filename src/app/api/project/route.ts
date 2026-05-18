import { NextResponse } from "next/server";
import { readProjectState } from "@/lib/project-store";

export async function GET() {
  const state = await readProjectState();
  return NextResponse.json(state);
}
