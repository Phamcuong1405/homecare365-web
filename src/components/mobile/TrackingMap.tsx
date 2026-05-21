"use client";

import type { TrackingPoint } from "@/lib/tracking-types";
import { useEffect, useRef } from "react";

type Props = {
  staffLat: number;
  staffLng: number;
  destLat: number;
  destLng: number;
  path: TrackingPoint[];
  sharing: boolean;
};

export function TrackingMap({ staffLat, staffLng, destLat, destLng, path, sharing }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const staffMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const routeRef = useRef<import("leaflet").Polyline | null>(null);

  useEffect(() => {
    async function init() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([destLat, destLng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map);

      const homeIcon = L.divIcon({
        className: "",
        html: '<div style="background:#0047ab;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)">🏠</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const staffIcon = L.divIcon({
        className: "",
        html: `<div style="background:#4caf50;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25)">${sharing ? "🚗" : "👩‍🔧"}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([destLat, destLng], { icon: homeIcon }).addTo(map).bindPopup("Nhà khách");
      staffMarkerRef.current = L.marker([staffLat, staffLng], { icon: staffIcon })
        .addTo(map)
        .bindPopup(sharing ? "Nhân viên đang di chuyển" : "Nhân viên");

      const bounds = L.latLngBounds([
        [destLat, destLng],
        [staffLat, staffLng],
      ]);
      map.fitBounds(bounds.pad(0.2));
      mapRef.current = map;
    }

    init();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [destLat, destLng]);

  useEffect(() => {
    if (!mapRef.current || !staffMarkerRef.current) return;

    async function update() {
      const L = (await import("leaflet")).default;
      staffMarkerRef.current?.setLatLng([staffLat, staffLng]);

      const pts: [number, number][] = path.map((p) => [p.lat, p.lng]);
      if (pts.length === 0) pts.push([staffLat, staffLng]);
      pts.push([destLat, destLng]);

      if (routeRef.current) routeRef.current.remove();
      routeRef.current = L.polyline(pts, {
        color: "#4caf50",
        weight: 4,
        opacity: 0.85,
        dashArray: sharing ? undefined : "8 8",
      }).addTo(mapRef.current!);

      const bounds = L.latLngBounds(pts);
      mapRef.current?.fitBounds(bounds.pad(0.15));
    }

    update();
  }, [staffLat, staffLng, destLat, destLng, path, sharing]);

  return <div ref={containerRef} className="h-56 w-full rounded-2xl" />;
}
