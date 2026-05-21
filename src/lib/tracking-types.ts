export type TrackingStatus = "waiting" | "en_route" | "arrived" | "working" | "done";

export type TrackingPoint = {
  lat: number;
  lng: number;
  at: number;
};

export type TrackingSession = {
  jobId: string;
  status: TrackingStatus;
  staffName: string;
  sharing: boolean;
  staffLat: number;
  staffLng: number;
  destLat: number;
  destLng: number;
  destAddress: string;
  path: TrackingPoint[];
  updatedAt: number;
};

export type TrackingUpdatePayload = {
  action: "trackingStart" | "trackingUpdate" | "trackingStop";
  jobId: string;
  staffName?: string;
  staffLat?: number;
  staffLng?: number;
  destLat?: number;
  destLng?: number;
  destAddress?: string;
  status?: TrackingStatus;
  sharing?: boolean;
  pathJson?: string;
  updatedAt?: number;
};
