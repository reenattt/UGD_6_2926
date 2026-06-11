"use client";

import { useEffect, useRef, useState } from "react";
import { AIRPORT_MASTER_DATA } from "../lib/airports";

// =====================================================================
// BEARING — compass heading from point A to point B
// =====================================================================
function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// =====================================================================
// LERP — linear interpolation
// =====================================================================
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// =====================================================================
// AIRCRAFT DIV ICON
// =====================================================================
function makeAircraftIcon(L: any, bearing: number, color: string, highlighted = false, dimmed = false) {
  const size = highlighted ? 28 : 22;
  const opacity = dimmed ? 0.3 : 1;
  return L.divIcon({
    html: `<div style="
      transform: rotate(${bearing}deg);
      font-size: ${size}px;
      color: ${color};
      opacity: ${opacity};
      filter: ${highlighted ? "drop-shadow(0 0 6px " + color + ")" : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))"};
      text-shadow: 0px 0px 3px rgba(255,255,255,0.9), 0px 0px 3px rgba(255,255,255,0.9);
      line-height: 1;
      user-select: none;
    ">✈</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// =====================================================================
// AIRPORT MARKER ICON
// =====================================================================
function makeAirportIcon(L: any, code: string, highlighted = false, dimmed = false) {
  const bg = highlighted ? "#ea580c" : "#ffffff";
  const border = highlighted ? "#fff" : "#cbd5e1";
  const opacity = dimmed ? 0.4 : 1;
  const textColor = highlighted ? "#ffffff" : "#475569";
  return L.divIcon({
    html: `<div style="
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: ${textColor};
      opacity: ${opacity};
      letter-spacing: -0.5px;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    ">${code}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// =====================================================================
// COMPONENT PROPS
// =====================================================================
interface TrackingMapProps {
  shipment?: any;    // null/undefined = show all flights; object = highlight searched shipment
  compact?: boolean; // true = home widget (smaller), false = full tracking page
  globalShipments?: any[]; // Allow parents to pass data directly to skip fetch
}

// =====================================================================
// TRACKING MAP COMPONENT
// =====================================================================
export default function TrackingMap({ shipment, compact = false, globalShipments: initialShipments }: TrackingMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const flightStateRef = useRef<any[]>([]);
  const aircraftMarkersRef = useRef<any[]>([]);
  const routeLinesRef = useRef<any[]>([]);
  const progressLinesRef = useRef<any[]>([]);
  const airportMarkersRef = useRef<Record<string, any>>({});
  const highlightedFlightRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  // Use either the prop or local state to store shipments
  const [dbShipments, setDbShipments] = useState<any[] | null>(initialShipments || null);

  useEffect(() => {
    if (initialShipments) return;
    // Fetch live shipments from the DB
    fetch('/api/shipments')
      .then(r => r.json())
      .then(data => setDbShipments(Array.isArray(data) ? data : []))
      .catch(() => setDbShipments([]));
  }, [initialShipments]);

  // ---- 1. INITIALIZE MAP ONCE DATA IS READY -------------------------
  useEffect(() => {
    if (dbShipments === null) return; // Wait until fetch is complete
    if (initializedRef.current || !mapDivRef.current) return;
    initializedRef.current = true;

    // Filter shipments that actually have coordinates and are active
    const validShipments = dbShipments.filter(s => s.origin_lat && s.dest_lat && s.shipping_status !== "Delivered");
    
    // Build synthetic live flight logic from real database rows
    const liveFlights = validShipments.map((s, idx) => {
      const colors = ["#2563eb", "#ea580c", "#9333ea", "#059669"];
      const idNum = parseInt(s.awb.replace(/\D/g, '')) || idx;
      return {
        id: s.awb,
        origin: s.origin_city,
        dest: s.destination_city,
        status: s.shipping_status,
        progress: (idNum % 100) / 100, // pseudo-random deterministic start
        speed: 0.00015 + ((idNum % 10) * 0.000015), // deterministic speed variation
        color: colors[idNum % colors.length],
        origLat: Number(s.origin_lat) || 0,
        origLng: Number(s.origin_lng) || 0,
        destLat: Number(s.dest_lat) || 0,
        destLng: Number(s.dest_lng) || 0,
      };
    });
    
    flightStateRef.current = liveFlights;

    let L: any;
    let map: any;

    (async () => {
      L = (await import("leaflet")).default;

      // Fix default marker icon path issue in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      map = L.map(mapDivRef.current!, {
        center: compact ? [0, 110] : [2, 112],
        zoom: compact ? 4 : 5,
        zoomControl: !compact,
        attributionControl: !compact,
        scrollWheelZoom: true,
        dragging: true,
      });

      mapRef.current = map;

      // Colored map tile layer (Standard OSM style)
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      // ---- Draw airports ----
      const usedAirportCodes = new Set<string>();
      liveFlights.forEach((f) => {
        usedAirportCodes.add(f.origin);
        usedAirportCodes.add(f.dest);
      });

      usedAirportCodes.forEach((code) => {
        const airport = AIRPORT_MASTER_DATA[code];
        if (!airport) return;
        const marker = L.marker([airport.lat, airport.lng], {
          icon: makeAirportIcon(L, code),
          zIndexOffset: 100,
        })
          .addTo(map)
          .bindTooltip(`${code} — ${airport.city}`, {
            permanent: false,
            direction: "top",
            className: "",
          });
        airportMarkersRef.current[code] = marker;
      });

      // ---- Draw routes + aircraft for each LIVE shipment ----
      liveFlights.forEach((flight, i) => {
        const routeLine = L.polyline([[flight.origLat, flight.origLng], [flight.destLat, flight.destLng]], {
          color: flight.color,
          weight: 3,
          opacity: 0.7,
          dashArray: "6 6",
        }).addTo(map);
        routeLinesRef.current[i] = routeLine;

        const progressLine = L.polyline([], {
          color: flight.color,
          weight: 4,
          opacity: 1,
        }).addTo(map);
        progressLinesRef.current[i] = progressLine;

        const bearing = getBearing(flight.origLat, flight.origLng, flight.destLat, flight.destLng);
        const lat = lerp(flight.origLat, flight.destLat, flight.progress);
        const lng = lerp(flight.origLng, flight.destLng, flight.progress);

        const marker = L.marker([lat, lng], {
          icon: makeAircraftIcon(L, bearing, flight.color),
          zIndexOffset: 200,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:'Inter', sans-serif;font-size:11px;line-height:1.6;color:#334155;min-width:160px;padding:2px;">
              <div style="font-weight:800;font-size:13px;margin-bottom:6px;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">
                ✈ Flight Details
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span style="color:#64748b;font-weight:600;">Aircraft:</span>
                <span style="font-weight:700;">Boeing 737 Cargo</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span style="color:#64748b;font-weight:600;">AWB:</span>
                <span style="font-weight:800;color:${flight.color}">${flight.id}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span style="color:#64748b;font-weight:600;">Route:</span>
                <span style="font-weight:700;">${flight.origin} ➔ ${flight.dest}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#64748b;font-weight:600;">Status:</span>
                <span style="font-weight:700;color:#059669;">${flight.status || 'In Transit'}</span>
              </div>
            </div>`,
            { className: "", closeButton: false }
          );
        aircraftMarkersRef.current[i] = marker;
      });

      // ---- Start animation loop ----
      function animate() {
        rafRef.current = requestAnimationFrame(animate);
        flightStateRef.current.forEach((flight, i) => {
          flight.progress += flight.speed;
          if (flight.progress > 1) flight.progress = 0;

          const lat = lerp(flight.origLat, flight.destLat, flight.progress);
          const lng = lerp(flight.origLng, flight.destLng, flight.progress);
          const bearing = getBearing(flight.origLat, flight.origLng, flight.destLat, flight.destLng);

          const aircraftMarker = aircraftMarkersRef.current[i];
          if (!aircraftMarker) return;

          aircraftMarker.setLatLng([lat, lng]);

          const isHighlighted = highlightedFlightRef.current === flight.id;
          const isDimmed = highlightedFlightRef.current !== null && !isHighlighted;

          aircraftMarker.setIcon(
            makeAircraftIcon(L, bearing, flight.color, isHighlighted, isDimmed)
          );

          const progressLine = progressLinesRef.current[i];
          if (progressLine) {
            progressLine.setLatLngs([
              [flight.origLat, flight.origLng],
              [lat, lng],
            ]);
          }
        });
      }
      animate();
    })();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [dbShipments, compact]);

  // ---- 2. RESPOND TO SEARCH PROP CHANGES -------------------------
  useEffect(() => {
    if (!mapRef.current || !dbShipments) return;

    if (!shipment) {
      // Reset Highlight
      highlightedFlightRef.current = null;
      mapRef.current?.closePopup();
      Object.entries(airportMarkersRef.current).forEach(([, marker]) => {
        const el = marker.getElement();
        if (el) {
          const div = el.querySelector("div");
          if (div) {
            div.style.opacity = "1";
            div.style.background = "#ffffff";
            div.style.borderColor = "#cbd5e1";
            div.style.color = "#475569";
          }
        }
      });
      routeLinesRef.current.forEach((line) => {
        if (line) line.setStyle({ opacity: 0.7, weight: 3 });
      });
      return;
    }

    const origCode = shipment.origin_city;
    const destCode = shipment.destination_city;

    // Find the flight in our active DB list
    let matchedFlightIndex = -1;
    flightStateRef.current.forEach((f, i) => {
      if (f.id === shipment.awb) {
        matchedFlightIndex = i;
      }
    });

    if (matchedFlightIndex !== -1) {
      const matchedFlight = flightStateRef.current[matchedFlightIndex];
      highlightedFlightRef.current = matchedFlight.id;
      
      const marker = aircraftMarkersRef.current[matchedFlightIndex];
      if (marker) {
        marker.openPopup();
      }
    }

    // Highlight airport markers via DOM
    Object.entries(airportMarkersRef.current).forEach(([code, marker]) => {
      const isOrigin = code === origCode;
      const isDest = code === destCode;
      const el = marker.getElement();
      if (el) {
        const div = el.querySelector("div");
        if (div) {
          if (isOrigin) {
            div.style.opacity = "1";
            div.style.background = "#22c55e";
            div.style.borderColor = "#ffffff";
            div.style.color = "#ffffff";
          } else if (isDest) {
            div.style.opacity = "1";
            div.style.background = "#ea580c";
            div.style.borderColor = "#ffffff";
            div.style.color = "#ffffff";
          } else {
            div.style.opacity = "0.4";
          }
        }
      }
    });

    // Highlight route lines
    routeLinesRef.current.forEach((line, i) => {
      if (!line) return;
      if (i === matchedFlightIndex) {
        line.setStyle({ opacity: 0.9, weight: 3, color: "#f97316" });
      } else {
        line.setStyle({ opacity: 0.1, weight: 1 });
      }
    });

    // Fly map to route bounds
    if (shipment.origin_lat && shipment.dest_lat && mapRef.current) {
      const origLat = Number(shipment.origin_lat) || 0;
      const origLng = Number(shipment.origin_lng) || 0;
      const destLat = Number(shipment.dest_lat) || 0;
      const destLng = Number(shipment.dest_lng) || 0;
      
      const bounds = [
        [Math.min(origLat, destLat) - 1, Math.min(origLng, destLng) - 2],
        [Math.max(origLat, destLat) + 1, Math.max(origLng, destLng) + 2],
      ];
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [shipment, dbShipments]);

  return (
    <div
      ref={mapDivRef}
      className={`w-full h-full bg-slate-50 ${
        !compact ? "rounded-b-2xl" : ""
      }`}
    />
  );
}
