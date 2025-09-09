"use client";
import CampusMap from "@/components/map/CampusMap";

import { useJsApiLoader } from "@react-google-maps/api";

export default function MapPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: [], // add 'places' if you later need search/autocomplete
  });

  if (loadError) return <div className="p-6">Failed to load Google Maps.</div>;
  if (!isLoaded) return <div className="p-6">Loading map…</div>;

  return <CampusMap />;
}
