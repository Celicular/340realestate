// src/components/maps/MapPicker.jsx
import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";

const MAPTILER_KEY = "g6kL6VLHbsj5TeZn9lr8";

maptilersdk.config.apiKey = MAPTILER_KEY;

const DEFAULT_CENTER = {
  lat: 18.3358,   // St. John approx
  lng: -64.8963,
};

const MapPicker = ({ lat, lng, onChange, height = 320 }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Search UI state
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // ---------- INIT MAP ----------
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const center = {
      lat: typeof lat === "number" ? lat : DEFAULT_CENTER.lat,
      lng: typeof lng === "number" ? lng : DEFAULT_CENTER.lng,
    };

    mapRef.current = new maptilersdk.Map({
      container: mapContainerRef.current,
      center: [center.lng, center.lat],
      zoom: 12,
      style: maptilersdk.MapStyle.STREETS,
    });

    // Add draggable marker
    markerRef.current = new maptilersdk.Marker({ draggable: true })
      .setLngLat([center.lng, center.lat])
      .addTo(mapRef.current);

    // When marker is dragged
    markerRef.current.on("dragend", () => {
      const pos = markerRef.current.getLngLat();
      if (onChange) onChange({ lat: pos.lat, lng: pos.lng });
    });

    // Click map to move marker
    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      }
      if (onChange) onChange({ lat, lng });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- UPDATE MARKER IF PROPS CHANGE ----------
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const newPos = [lng, lat];
    markerRef.current.setLngLat(newPos);
    mapRef.current.setCenter(newPos);
  }, [lat, lng]);

  // ---------- HELPER: Move map + marker ----------
  const moveToLocation = (lng, lat, zoom = 14) => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLngLat([lng, lat]);
    mapRef.current.flyTo({ center: [lng, lat], zoom });

    if (onChange) {
      onChange({ lat, lng });
    }
  };

  // ---------- SEARCH HANDLER ----------
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchLoading(true);
    setSearchError("");
    setShowResults(false);
    setResults([]);

    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
        trimmed
      )}.json?key=${MAPTILER_KEY}&limit=5`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      const features = data.features || [];

      if (features.length === 0) {
        setSearchError("No results found.");
        setSearchLoading(false);
        return;
      }

      setResults(features);
      setShowResults(true);

      // Move to first result immediately
      const first = features[0];
      const [lng, lat] =
        first.center || first.geometry?.coordinates || [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat];

      moveToLocation(lng, lat);
    } catch (err) {
      console.error(err);
      setSearchError("Could not search this place. Try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ---------- CLICK RESULT ----------
  const handleResultClick = (feature) => {
    const [lng, lat] =
      feature.center || feature.geometry?.coordinates || [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat];

    moveToLocation(lng, lat);
    setShowResults(false);
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="mb-3">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchError("");
              }}
              placeholder="Search address or place (e.g. Cruz Bay)..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-24 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="mt-1 text-xs text-red-600">{searchError}</p>
        )}

        {showResults && results.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm shadow-md z-10">
            {results.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleResultClick(f)}
                className="block w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
              >
                <div className="font-medium">
                  {f.place_name || f.text || "Result"}
                </div>
                {f.properties?.country && (
                  <div className="text-xs text-gray-500">
                    {f.properties?.locality || f.properties?.region}{" "}
                    {f.properties?.country}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="w-full rounded-lg border border-gray-200"
        style={{ height }}
      />
    </div>
  );
};

export default MapPicker;
