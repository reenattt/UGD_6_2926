"use client";

import { useEffect, useRef } from "react";

// =====================================================================
// AIRPORT DATA — Real-world coordinates for SE Asian cargo airports
// =====================================================================
const AIRPORTS: Record<string, { code: string; city: string; lat: number; lng: number }> = {
  CGK: { code: "CGK", city: "Jakarta",    lat: -6.1256,  lng: 106.6559 },
  SIN: { code: "SIN", city: "Singapore",  lat:  1.3644,  lng: 103.9915 },
  HKG: { code: "HKG", city: "Hong Kong",  lat: 22.3080,  lng: 113.9185 },
  BKK: { code: "BKK", city: "Bangkok",    lat: 13.6900,  lng: 100.7501 },
  KUL: { code: "KUL", city: "Kuala Lumpur", lat: 2.7456, lng: 101.7099 },
  DPS: { code: "DPS", city: "Bali",       lat: -8.7482,  lng: 115.1672 },
  SUB: { code: "SUB", city: "Surabaya",   lat: -7.3798,  lng: 112.7870 },
  BDO: { code: "BDO", city: "Bandung",    lat: -6.9007,  lng: 107.5762 },
  KNO: { code: "KNO", city: "Medan",      lat:  3.6421,  lng:  98.8856 },
  UPG: { code: "UPG", city: "Makassar",   lat: -5.0617,  lng: 119.5540 },
  SRG: { code: "SRG", city: "Semarang",   lat: -6.9724,  lng: 110.3750 },
  JOG: { code: "JOG", city: "Yogyakarta", lat: -7.7880,  lng: 110.4316 },
  PKU: { code: "PKU", city: "Pekanbaru",  lat:  0.4608,  lng: 101.4449 },
  BTH: { code: "BTH", city: "Batam",      lat:  1.1212,  lng: 104.1188 },
  PNK: { code: "PNK", city: "Pontianak",  lat: -0.1503,  lng: 109.4035 },
};

// =====================================================================
// ACTIVE FLIGHTS — Static Sky Link cargo routes
// =====================================================================
const ACTIVE_FLIGHTS = [
  { id: "SL-001", origin: "CGK", dest: "SIN", progress: 0.10, speed: 0.00025, color: "#f97316" },
  { id: "SL-002", origin: "BDO", dest: "SIN", progress: 0.35, speed: 0.00020, color: "#3b82f6" },
  { id: "SL-003", origin: "SUB", dest: "HKG", progress: 0.60, speed: 0.00015, color: "#8b5cf6" },
  { id: "SL-004", origin: "CGK", dest: "BKK", progress: 0.20, speed: 0.00022, color: "#06b6d4" },
  { id: "SL-005", origin: "DPS", dest: "KUL", progress: 0.75, speed: 0.00028, color: "#10b981" },
  { id: "SL-006", origin: "KNO", dest: "SIN", progress: 0.45, speed: 0.00018, color: "#f59e0b" },
  { id: "SL-007", origin: "UPG", dest: "CGK", progress: 0.55, speed: 0.00021, color: "#ec4899" },
  { id: "SL-008", origin: "SRG", dest: "CGK", progress: 0.30, speed: 0.00030, color: "#14b8a6" },
];

// =====================================================================
// AIRPORT LOOKUP — maps city name / code to airport object
// =====================================================================
function resolveAirport(key: string) {
  if (!key) return AIRPORTS.CGK;
  const norm = key.trim().toUpperCase();
  if (AIRPORTS[norm]) return AIRPORTS[norm];
  const byCity = Object.values(AIRPORTS).find(
    (a) => a.city.toUpperCase() === norm || norm.includes(a.city.toUpperCase())
  );
  return byCity || AIRPORTS.CGK;
}

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
// AIRCRAFT DIV ICON — inline SVG emoji with rotation
// =====================================================================
function makeAircraftIcon(L: any, bearing: number, color: string, highlighted = false, dimmed = false) {
  const size = highlighted ? 28 : 20;
  const opacity = dimmed ? 0.3 : 1;
  return L.divIcon({
    html: `<div style="
      transform: rotate(${bearing}deg);
      font-size: ${size}px;
      color: ${color};
      opacity: ${opacity};
      filter: ${highlighted ? "drop-shadow(0 0 6px " + color + ")" : "none"};
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
  const bg = highlighted ? "#f97316" : "#1e293b";
  const border = highlighted ? "#fff" : "#475569";
  const opacity = dimmed ? 0.3 : 1;
  return L.divIcon({
    html: `<div style="
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
      color: ${highlighted ? "#1e293b" : "#e2e8f0"};
      opacity: ${opacity};
      letter-spacing: -0.5px;
      font-family: monospace;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">${code}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// =====================================================================
// COMPONENT PROPS
// =====================================================================
interface TrackingMapProps {
  shipment?: any;    // null/undefined = show all flights; object = highlight searched shipment
  compact?: boolean; // true = home widget (smaller), false = full tracking page
}

// =====================================================================
// TRACKING MAP COMPONENT
// =====================================================================
export default function TrackingMap({ shipment, compact = false }: TrackingMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const flightStateRef = useRef(ACTIVE_FLIGHTS.map((f) => ({ ...f })));
  const aircraftMarkersRef = useRef<any[]>([]);
  const routeLinesRef = useRef<any[]>([]);
  const progressLinesRef = useRef<any[]>([]);
  const airportMarkersRef = useRef<Record<string, any>>({});
  const highlightedFlightRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  // ---- 1. INITIALIZE MAP (runs once) --------------------------------
  useEffect(() => {
    if (initializedRef.current || !mapDivRef.current) return;
    initializedRef.current = true;

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

      // Dark tile layer (Carto Dark Matter for FlightRadar feel)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // ---- Draw airports ----
      const usedAirportCodes = new Set<string>();
      flightStateRef.current.forEach((f) => {
        usedAirportCodes.add(f.origin);
        usedAirportCodes.add(f.dest);
      });

      usedAirportCodes.forEach((code) => {
        const airport = AIRPORTS[code];
        if (!airport) return;
        const marker = L.marker([airport.lat, airport.lng], {
          icon: makeAirportIcon(L, code),
          zIndexOffset: 100,
        })
          .addTo(map)
          .bindTooltip(`${code} — ${airport.city}`, {
            permanent: false,
            direction: "top",
            className: "leaflet-tooltip-dark",
          });
        airportMarkersRef.current[code] = marker;
      });

      // ---- Draw routes + aircraft for each flight ----
      flightStateRef.current.forEach((flight, i) => {
        const orig = AIRPORTS[flight.origin];
        const dest = AIRPORTS[flight.dest];
        if (!orig || !dest) return;

        // Full dashed route line
        const routeLine = L.polyline([[orig.lat, orig.lng], [dest.lat, dest.lng]], {
          color: flight.color,
          weight: 1.5,
          opacity: 0.35,
          dashArray: "6 6",
        }).addTo(map);
        routeLinesRef.current[i] = routeLine;

        // Progress line (solid, shorter)
        const progressLine = L.polyline([], {
          color: flight.color,
          weight: 2.5,
          opacity: 0.85,
        }).addTo(map);
        progressLinesRef.current[i] = progressLine;

        // Initial bearing
        const bearing = getBearing(orig.lat, orig.lng, dest.lat, dest.lng);
        const lat = lerp(orig.lat, dest.lat, flight.progress);
        const lng = lerp(orig.lng, dest.lng, flight.progress);

        const marker = L.marker([lat, lng], {
          icon: makeAircraftIcon(L, bearing, flight.color),
          zIndexOffset: 200,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:monospace;font-size:12px;line-height:1.6">
              <strong style="color:${flight.color}">${flight.id}</strong><br/>
              <span style="color:#94a3b8">Route:</span> ${flight.origin} ✈ ${flight.dest}<br/>
              <span style="color:#94a3b8">Status:</span> In Flight
            </div>`,
            { className: "leaflet-popup-dark" }
          );
        aircraftMarkersRef.current[i] = marker;
      });

      // ---- Start animation loop ----
      function animate() {
        rafRef.current = requestAnimationFrame(animate);
        flightStateRef.current.forEach((flight, i) => {
          const orig = AIRPORTS[flight.origin];
          const dest = AIRPORTS[flight.dest];
          if (!orig || !dest) return;

          flight.progress += flight.speed;
          if (flight.progress > 1) flight.progress = 0;

          const lat = lerp(orig.lat, dest.lat, flight.progress);
          const lng = lerp(orig.lng, dest.lng, flight.progress);
          const bearing = getBearing(orig.lat, orig.lng, dest.lat, dest.lng);

          const aircraftMarker = aircraftMarkersRef.current[i];
          if (!aircraftMarker) return;

          aircraftMarker.setLatLng([lat, lng]);

          // Determine highlight/dim state
          const isHighlighted = highlightedFlightRef.current === flight.id;
          const isDimmed =
            highlightedFlightRef.current !== null && !isHighlighted;

          aircraftMarker.setIcon(
            makeAircraftIcon(L, bearing, flight.color, isHighlighted, isDimmed)
          );

          // Update progress line
          const progressLine = progressLinesRef.current[i];
          if (progressLine) {
            progressLine.setLatLngs([
              [orig.lat, orig.lng],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- 2. RESPOND TO SHIPMENT PROP CHANGES -------------------------
  useEffect(() => {
    if (!mapRef.current) return;

    const L = (window as any).L || null;
    // We need to re-import L for icon updates — use the stored ref instead
    // Access flight states and markers directly via refs

    if (!shipment) {
      // Reset: un-highlight everything
      highlightedFlightRef.current = null;

      // Reset airport markers
      Object.entries(airportMarkersRef.current).forEach(([, marker]) => {
        // We can't easily rebuild icons without L here — just update opacity via element
        const el = marker.getElement();
        if (el) {
          const div = el.querySelector("div");
          if (div) {
            div.style.opacity = "1";
            div.style.background = "#1e293b";
            div.style.borderColor = "#475569";
            div.style.color = "#e2e8f0";
          }
        }
      });

      // Reset route lines
      routeLinesRef.current.forEach((line) => {
        if (line) {
          line.setStyle({ opacity: 0.35, weight: 1.5 });
        }
      });

      return;
    }

    // Resolve origin + destination airport codes from shipment
    const origAirport = resolveAirport(shipment.origin_city);
    const destAirport = resolveAirport(shipment.destination_city);

    // Find the best matching flight
    let matchedFlightIndex = -1;
    flightStateRef.current.forEach((f, i) => {
      if (f.origin === origAirport.code && f.dest === destAirport.code) {
        matchedFlightIndex = i;
      }
    });

    // If no exact match, use SL-001 as fallback
    if (matchedFlightIndex === -1) matchedFlightIndex = 0;

    const matchedFlight = flightStateRef.current[matchedFlightIndex];
    highlightedFlightRef.current = matchedFlight.id;

    // Highlight airport markers via DOM
    Object.entries(airportMarkersRef.current).forEach(([code, marker]) => {
      const isOrigin = code === origAirport.code;
      const isDest = code === destAirport.code;
      const el = marker.getElement();
      if (el) {
        const div = el.querySelector("div");
        if (div) {
          if (isOrigin) {
            div.style.opacity = "1";
            div.style.background = "#22c55e";
            div.style.borderColor = "#fff";
            div.style.color = "#0f172a";
          } else if (isDest) {
            div.style.opacity = "1";
            div.style.background = "#f97316";
            div.style.borderColor = "#fff";
            div.style.color = "#0f172a";
          } else {
            div.style.opacity = "0.25";
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
    const orig = AIRPORTS[matchedFlight.origin];
    const dest = AIRPORTS[matchedFlight.dest];
    if (orig && dest && mapRef.current) {
      const bounds = [
        [Math.min(orig.lat, dest.lat) - 1, Math.min(orig.lng, dest.lng) - 2],
        [Math.max(orig.lat, dest.lat) + 1, Math.max(orig.lng, dest.lng) + 2],
      ];
      mapRef.current.fitBounds(bounds, { padding: [30, 30], animate: true });
    }

    // Open popup on matched aircraft after a small delay
    setTimeout(() => {
      const marker = aircraftMarkersRef.current[matchedFlightIndex];
      if (marker && mapRef.current) {
        marker.openPopup();
      }
    }, 600);
  }, [shipment]);

  return (
    <div
      ref={mapDivRef}
      className="w-full h-full"
      style={{ background: "#0f172a" }}
    />
  );
}
