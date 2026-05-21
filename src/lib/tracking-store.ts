import { getWebhookUrl } from "@/lib/google-sheet-upstream";
import type { TrackingSession, TrackingUpdatePayload } from "@/lib/tracking-types";
import { appendPath, geocodeAddress } from "@/lib/tracking-utils";

const GLOBAL_KEY = "__hc365_tracking_store__";

function memoryStore(): Map<string, TrackingSession> {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: Map<string, TrackingSession> };
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = new Map();
  return g[GLOBAL_KEY];
}

function defaultSession(jobId: string, partial?: Partial<TrackingSession>): TrackingSession {
  return {
    jobId,
    status: "waiting",
    staffName: "Nhân viên HomeCare365",
    sharing: false,
    staffLat: 21.02,
    staffLng: 105.82,
    destLat: 21.0285,
    destLng: 105.8542,
    destAddress: "",
    path: [],
    updatedAt: Date.now(),
    ...partial,
  };
}

async function fetchFromSheet(jobId: string): Promise<TrackingSession | null> {
  const base = getWebhookUrl();
  if (!base.includes("script.google.com")) return null;

  try {
    const url = `${base}?action=trackingGet&jobId=${encodeURIComponent(jobId)}`;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    const parsed = JSON.parse(text) as { ok?: boolean; session?: TrackingSession };
    if (parsed.ok && parsed.session) return parsed.session;
  } catch {
    /* fallback memory */
  }
  return null;
}

async function pushToSheet(payload: TrackingUpdatePayload): Promise<boolean> {
  const base = getWebhookUrl();
  if (!base.includes("script.google.com")) return false;

  try {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const text = await res.text();
    const parsed = JSON.parse(text) as { ok?: boolean };
    return parsed.ok === true;
  } catch {
    return false;
  }
}

export async function getTrackingSession(jobId: string): Promise<TrackingSession | null> {
  const fromSheet = await fetchFromSheet(jobId);
  if (fromSheet) {
    memoryStore().set(jobId, fromSheet);
    return fromSheet;
  }
  return memoryStore().get(jobId) ?? null;
}

export async function applyTrackingUpdate(
  payload: TrackingUpdatePayload,
): Promise<TrackingSession> {
  const store = memoryStore();
  let session = store.get(payload.jobId) ?? (await fetchFromSheet(payload.jobId));

  if (payload.action === "trackingStart" || !session) {
    let destLat = payload.destLat;
    let destLng = payload.destLng;
    if (payload.destAddress && (destLat == null || destLng == null)) {
      const geo = await geocodeAddress(payload.destAddress);
      destLat = geo.lat;
      destLng = geo.lng;
    }
    session = defaultSession(payload.jobId, {
      destLat,
      destLng,
      destAddress: payload.destAddress,
      staffName: payload.staffName ?? "Nhân viên HomeCare365",
      status: "waiting",
      sharing: false,
    });
  }

  if (payload.staffName) session.staffName = payload.staffName;
  if (payload.destLat != null) session.destLat = payload.destLat;
  if (payload.destLng != null) session.destLng = payload.destLng;
  if (payload.destAddress) session.destAddress = payload.destAddress;
  if (payload.status) session.status = payload.status;

  if (payload.action === "trackingStop") {
    session.sharing = false;
    session.status = session.status === "done" ? "done" : "waiting";
  } else if (payload.sharing != null) {
    session.sharing = payload.sharing;
    if (payload.sharing && session.status === "waiting") session.status = "en_route";
  }

  if (payload.staffLat != null && payload.staffLng != null && session.sharing) {
    session.staffLat = payload.staffLat;
    session.staffLng = payload.staffLng;
    session.path = appendPath(session.path, payload.staffLat, payload.staffLng);
    if (session.status === "waiting") session.status = "en_route";
  }

  session.updatedAt = Date.now();
  store.set(payload.jobId, session);
  await pushToSheet({
    action: "trackingUpdate",
    jobId: session.jobId,
    status: session.status,
    staffName: session.staffName,
    sharing: session.sharing,
    staffLat: session.staffLat,
    staffLng: session.staffLng,
    destLat: session.destLat,
    destLng: session.destLng,
    destAddress: session.destAddress,
    pathJson: JSON.stringify(session.path),
    updatedAt: session.updatedAt,
  } as TrackingUpdatePayload & { pathJson: string });
  return session;
}
