"use client";

import React, { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { Clinic, TargetCity } from "@/types/clinic";

export interface ClinicGoogleMapProps {
  clinics: Clinic[];
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: Clinic) => void;
  targetCity?: TargetCity;
  className?: string;
}

// Medical teal pin SVG path
const PIN_SVG =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

export function ClinicGoogleMap({
  clinics,
  selectedClinicId,
  onSelectClinic,
  targetCity,
  className = "",
}: ClinicGoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const targetCityRef = useRef<TargetCity | undefined>(targetCity);

  useEffect(() => {
    targetCityRef.current = targetCity;
  }, [targetCity]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Initialize Google Maps instance using modern functional API
  useEffect(() => {
    if (!apiKey) {
      setLoadError("API_KEY_MISSING");
      return;
    }

    let isSubscribed = true;

    try {
      setOptions({
        key: apiKey,
        v: "weekly",
      });

      Promise.all([importLibrary("maps"), importLibrary("marker")])
        .then(([mapsLib]) => {
          if (!isSubscribed || !mapContainerRef.current) return;

          const defaultCenter = {
            lat: targetCityRef.current ? targetCityRef.current.latitude : 36.7538,
            lng: targetCityRef.current ? targetCityRef.current.longitude : 3.0588,
          };

          const map = new mapsLib.Map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: "poi.medical",
                elementType: "geometry",
                stylers: [{ color: "#d1fae5" }],
              },
              {
                featureType: "poi.medical",
                elementType: "labels.text.fill",
                stylers: [{ color: "#065f46" }],
              },
            ],
          });

          infoWindowRef.current = new mapsLib.InfoWindow();
          mapInstanceRef.current = map;
          setMapLoaded(true);
        })
        .catch((err: unknown) => {
          console.error("Google Maps failed to load:", err);
          if (isSubscribed) {
            setLoadError("LOAD_FAILED");
          }
        });
    } catch (err: unknown) {
      console.error("Failed to initialize Google Maps:", err);
      if (isSubscribed) {
        setLoadError("LOAD_FAILED");
      }
    }

    return () => {
      isSubscribed = false;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [apiKey]);

  // Center update when targetCity changes
  useEffect(() => {
    if (!mapInstanceRef.current || !targetCity) return;
    mapInstanceRef.current.panTo({
      lat: targetCity.latitude,
      lng: targetCity.longitude,
    });
  }, [targetCity]);

  // Sync Markers with clinics collection
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || typeof google === "undefined") return;

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (clinics.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    clinics.forEach((clinic) => {
      const isSelected = clinic.id === selectedClinicId;
      const position = { lat: clinic.latitude, lng: clinic.longitude };

      const marker = new google.maps.Marker({
        position,
        map,
        title: clinic.name,
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        icon: {
          path: PIN_SVG,
          fillColor: isSelected ? "#059669" : "#0284c7",
          fillOpacity: 1,
          strokeWeight: 1.5,
          strokeColor: "#ffffff",
          scale: isSelected ? 1.8 : 1.4,
          anchor: new google.maps.Point(12, 22),
        },
      });

      marker.addListener("click", () => {
        if (onSelectClinic) onSelectClinic(clinic);

        const content = `
          <div style="padding: 10px; max-width: 240px; font-family: inherit;">
            <div style="font-weight: 800; font-size: 14px; color: #0f172a; margin-bottom: 4px;">
              ${clinic.name}
            </div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
              ${clinic.address}
            </div>
            ${
              clinic.distance_km != null
                ? `<div style="display:inline-block; font-size: 11px; font-weight: 700; color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 9999px; margin-bottom: 8px;">
                    📍 ${clinic.distance_km} km away
                  </div>`
                : ""
            }
            <div style="font-size: 12px; font-weight: 600; color: #0284c7; margin-bottom: 8px;">
              👨‍⚕️ ${clinic.doctors_count || (clinic.doctors ? clinic.doctors.length : 1)} Doctors Available
            </div>
            <a href="tel:${clinic.phone}" style="display: block; font-size: 12px; font-weight: 700; color: #059669; text-decoration: none;">
              📞 ${clinic.phone}
            </a>
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (clinics.length > 1) {
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    } else if (clinics.length === 1) {
      map.setCenter({ lat: clinics[0].latitude, lng: clinics[0].longitude });
      map.setZoom(14);
    }
  }, [clinics, mapLoaded, selectedClinicId, onSelectClinic]);

  // Graceful Fallback UI when Google Maps API key is not present or offline
  if (loadError) {
    return (
      <div
        className={`relative w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col justify-between p-6 text-white min-h-[420px] shadow-2xl ${className}`}
      >
        <div className="flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Navigation className="size-3.5" />
            <span>Interactive Map Overview</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {targetCity ? `${targetCity.name} (${targetCity.arabic_name})` : "Algeria"}
          </span>
        </div>

        {/* Schematic Mock Grid representing the Map Pins */}
        <div className="my-auto py-8 text-center space-y-4 z-10">
          <div className="mx-auto size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <MapPin className="size-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-extrabold tracking-tight">
              {targetCity ? `Partner Health Centers: ${targetCity.name}` : "Interactive Clinic Map"}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Displaying {clinics.length} accredited medical centers within your selected area.
            </p>
          </div>

          {/* Interactive Quick Pin Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2 text-left">
            {clinics.map((c) => {
              const isSelected = c.id === selectedClinicId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectClinic && onSelectClinic(c)}
                  className={`p-3 rounded-2xl border text-xs transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg"
                      : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-bold text-white truncate">{c.name}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.address}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-emerald-400">
                    <span>{c.commune || c.city}</span>
                    {c.distance_km != null && <span>{c.distance_km} km</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 z-10">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="size-3.5 text-emerald-400" />
            <span>Select a health center above to inspect consultation services.</span>
          </span>
          <span className="font-bold text-emerald-400">Live Pilot Hub</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[420px] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
}

export default ClinicGoogleMap;
