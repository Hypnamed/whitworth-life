"use client";

import { useMemo, useState, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { MarkerClustererF } from "@react-google-maps/api";
import { CATEGORIES, PLACES, CAT_COLORS } from "@/data/places";
import { pinIcon } from "@/lib/mapIcons";
import { Button } from "../ui/button";

const MAP_CENTER = { lat: 47.7547, lng: -117.4177 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
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
  const [selectedCats, setSelectedCats] = useState(new Set(CATEGORIES));
  const [logic, setLogic] = useState("ANY");
  const [activeId, setActiveId] = useState(null);

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

  const markers = useMemo(() => PLACES.filter(matches), [matches]);

  const toggleCat = (cat) => {
    setSelectedCats((prev) => {
      const n = new Set(prev);
      n.has(cat) ? n.delete(cat) : n.add(cat);
      return n;
    });
  };

  const onLoad = useCallback(
    (map) => {
      if (!markers.length) return;
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 80);
    },
    [markers]
  );

  return (
    <div className="w-full h-[calc(100dvh-72px)] grid grid-rows-[auto_auto_1fr]">
      {/* Filter chips */}
      <div className="p-3 flex gap-2 flex-wrap backdrop-blur">
        {CATEGORIES.map((c) => {
          const on = selectedCats.has(c);
          return (
            <Button
              key={c}
              onClick={() => toggleCat(c)}
              className={`px-3 py-1 rounded-2xl border text-sm transition
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
          onClick={() => setSelectedCats(new Set(CATEGORIES))}
          className="ml-auto px-3 py-1 rounded-2xl border text-sm"
        >
          All
        </Button>
        <Button
          onClick={() => setSelectedCats(new Set())}
          className="px-3 py-1 rounded-2xl border text-sm"
        >
          None
        </Button>
      </div>

      {/* ANY / ALL logic toggle */}
      <div className="px-3 py-2 flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter logic:</span>
        <div className="flex gap-2">
          <Button
            onClick={() => setLogic("ANY")}
            className={`px-3 py-1 rounded-2xl border text-sm ${
              logic === "ANY"
                ? "text-white  border-black"
                : "bg-white text-primary hover:text-white"
            }`}
          >
            Any (Match at least one)
          </Button>
          <Button
            onClick={() => setLogic("ALL")}
            className={`px-3 py-1 rounded-2xl border text-sm ${
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
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={MAP_CENTER}
        zoom={16}
        options={mapOptions}
      >
        <MarkerClustererF averageCenter enableRetinaIcons gridSize={50}>
          {(clusterer) =>
            markers.map((p) => (
              <MarkerF
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
                clusterer={clusterer}
                icon={pinIcon(p.categories, CAT_COLORS)}
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
                      style={{ borderColor: "#e5e7eb", background: "#f8fafc" }}
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
      </GoogleMap>
    </div>
  );
}
