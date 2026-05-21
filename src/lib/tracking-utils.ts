import type { TrackingPoint } from "@/lib/tracking-types";

const HANOI = { lat: 21.0285, lng: 105.8542 };

export function generateJobId(): string {
  return `HC${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Ước tính ETA (phút) — tốc độ trung bình ~25 km/h trong đô thị */
export function estimateEtaMinutes(
  staffLat: number,
  staffLng: number,
  destLat: number,
  destLng: number,
): number {
  const km = haversineKm(staffLat, staffLng, destLat, destLng);
  if (km < 0.05) return 1;
  return Math.max(2, Math.round((km / 25) * 60));
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  const q = address.trim();
  if (!q) return HANOI;

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "vn");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "HomeCare365/1.0 (contact@homecare365.vn)" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return HANOI;
    const data = (await res.json()) as { lat: string; lon: string }[];
    if (!data[0]) return HANOI;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return HANOI;
  }
}

export function appendPath(
  path: TrackingPoint[],
  lat: number,
  lng: number,
): TrackingPoint[] {
  const last = path[path.length - 1];
  if (last && haversineKm(last.lat, last.lng, lat, lng) < 0.02) return path;
  const next = [...path, { lat, lng, at: Date.now() }];
  return next.slice(-120);
}
