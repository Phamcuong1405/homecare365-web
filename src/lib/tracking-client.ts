import type { TrackingSession, TrackingUpdatePayload } from "@/lib/tracking-types";

export async function fetchTracking(jobId: string): Promise<TrackingSession | null> {
  const res = await fetch(`/api/tracking/${encodeURIComponent(jobId)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { ok: boolean; session?: TrackingSession };
  return data.ok && data.session ? data.session : null;
}

export async function postTrackingUpdate(
  jobId: string,
  payload: Omit<TrackingUpdatePayload, "jobId" | "action"> & {
    action: TrackingUpdatePayload["action"];
  },
): Promise<TrackingSession | null> {
  const res = await fetch(`/api/tracking/${encodeURIComponent(jobId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, jobId }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { ok: boolean; session?: TrackingSession };
  return data.ok && data.session ? data.session : null;
}
