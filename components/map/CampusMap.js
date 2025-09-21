"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  MarkerClustererF,
  CircleF,
} from "@react-google-maps/api";
import { categories, places, colors } from "@/data/places";
import { pinIcon } from "@/lib/mapIcons";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";

const MAP_CENTER = { lat: 47.7531493070487, lng: -117.41635063409184 };
const DEFAULT_ZOOM = 17;
const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  gestureHandling: "greedy",
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function CampusMap() {
  const [selectedCats, setSelectedCats] = useState(new Set(categories));
  const [logic, setLogic] = useState("ANY");
  const [activeId, setActiveId] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [mapInstance, setMapInstance] = useState(null);

  // 👇 new: user position + accuracy
  const [userPos, setUserPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams?.get("id");
    if (id) setActiveId(id);
  }, [searchParams]);

  // get user location once on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(pos.coords.accuracy);
      },
      (err) => console.warn("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const matches = useCallback(
    (place) => {
      if (selectedCats.size === 0) return true;
      const has = (c) => selectedCats.has(c);
      const hits = place.categories.filter(has).length;
      return logic === "ANY"
        ? hits > 0
        : [...selectedCats].every((c) => place.categories.includes(c));
    },
    [selectedCats, logic]
  );

  const markers = useMemo(() => places.filter(matches), [matches]);

  const toggleCat = (cat) => {
    setSelectedCats((prev) => {
      const n = new Set(prev);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  };

  const onLoad = useCallback(
    (map) => {
      setMapInstance(map);
      if (!markers.length) return;
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 80);
      window.google.maps.event.addListenerOnce(map, "idle", () => {
        map.setZoom(zoom);
      });
    },
    [markers, zoom]
  );

  const handleZoomChanged = () => {
    if (mapInstance) {
      setZoom(mapInstance.getZoom());
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-72px)] grid grid-rows-[auto_auto_1fr] sm:rounded-xl overflow-hidden bg-background sm:shadow-lg">
      {/* Filter chips */}
      <div className="p-2 sm:p-3 flex gap-2 flex-wrap backdrop-blur">
        {categories.map((c) => {
          const on = selectedCats.has(c);
          return (
            <Button
              key={c}
              onClick={() => toggleCat(c)}
              className={`px-2.5 py-1 rounded-2xl border text-xs sm:text-sm transition
                ${
                  on
                    ? "bg-primary text-white border-black"
                    : "bg-white text-primary hover:text-white border-gray-300"
                }`}
              title={c}
            >
              {c}
            </Button>
          );
        })}
        <Button
          onClick={() => setSelectedCats(new Set(categories))}
          className="ml-auto px-2.5 py-1 rounded-2xl border text-xs sm:text-sm"
        >
          All
        </Button>
        <Button
          onClick={() => setSelectedCats(new Set())}
          className="px-2.5 py-1 rounded-2xl border text-xs sm:text-sm"
        >
          None
        </Button>
      </div>

      {/* ANY / ALL logic toggle */}
      <div className="px-2 sm:px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-gray-600">Filter logic:</span>
        <div className="flex gap-2">
          <Button
            onClick={() => setLogic("ANY")}
            className={`px-2.5 py-1 rounded-2xl border text-xs sm:text-sm ${
              logic === "ANY"
                ? "text-white  border-black"
                : "bg-white text-primary hover:text-white"
            }`}
          >
            Any (Match at least one)
          </Button>
          <Button
            onClick={() => setLogic("ALL")}
            className={`px-2.5 py-1 rounded-2xl border text-xs sm:text-sm ${
              logic === "ALL"
                ? "text-white border-black"
                : "bg-white text-primary hover:text-white"
            }`}
          >
            All (Must match all)
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-full min-h-[300px] sm:min-h-0">
        <GoogleMap
          onLoad={onLoad}
          onZoomChanged={handleZoomChanged}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={MAP_CENTER}
          zoom={zoom}
          options={mapOptions}
        >
          <MarkerClustererF averageCenter enableRetinaIcons gridSize={50}>
            {(clusterer) =>
              markers.map((p) => (
                <MarkerF
                  key={p.id}
                  position={{ lat: p.lat, lng: p.lng }}
                  clusterer={clusterer}
                  icon={pinIcon(p.categories, colors)}
                  onClick={() => setActiveId(p.id)}
                />
              ))
            }
          </MarkerClustererF>

          {/* Info windows */}
          {markers.map((p) =>
            p.id === activeId ? (
              <InfoWindowF
                key={`iw-${p.id}`}
                position={{ lat: p.lat, lng: p.lng }}
                onCloseClick={() => setActiveId(null)}
                options={{ pixelOffset: new google.maps.Size(0, -8) }}
              >
                <div className="space-y-2">
                  <div className="font-bold">{p.name}</div>
                  <div className="flex gap-2 flex-wrap">
                    {p.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-md p-1 text-xs border"
                        style={{
                          borderColor: "#e5e7eb",
                          background: "#f8fafc",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {p.desc && (
                    <div className="text-sm text-foreground font-normal">
                      {p.desc}
                    </div>
                  )}
                </div>
              </InfoWindowF>
            ) : null
          )}

          {/* 👇 User marker + accuracy circle */}
          {userPos && (
            <>
              <MarkerF
                position={userPos}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 7,
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                }}
              />
              <CircleF
                center={userPos}
                radius={15} // 👈 just 15 meters instead of GPS accuracy
                options={{
                  fillColor: "#4285F4",
                  fillOpacity: 0.15,
                  strokeColor: "#4285F4",
                  strokeOpacity: 0.4,
                  strokeWeight: 1,
                  clickable: false,
                }}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
