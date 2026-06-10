"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Load Leaflet map client-side only (Leaflet requires window)
const TrackingMap = dynamic(() => import("../ui/tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 text-sm animate-pulse">Loading radar...</div>
    </div>
  ),
});

// =====================================================================
// RADAR STATS — Fetched dynamically
// =====================================================================
const TOTAL_AIRPORTS = 11;

// Helper: format a timestamp as "DD MMM YYYY\nHH:MM WIB"
function formatTimestamp(ts: string | null | undefined) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  const date = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WIB";
  return { date, time };
}

export default function Tracking() {
  const router = useRouter();
  const [awb, setAwb] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "notfound">("idle");
  const [shipment, setShipment] = useState<any>(null);
  const [clock, setClock] = useState("");
  const [awbError, setAwbError] = useState("");
  const [totalFlights, setTotalFlights] = useState(8);
  const [loading, setLoading] = useState(false);

  // Live clock for radar panel
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch real total shipments to update radar
  useEffect(() => {
    fetch("/api/shipments")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTotalFlights(8 + data.length);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleTrack = async () => {
    if (loading) return;
    
    const isValidFormat = /^AWB\d{3,}$/i.test(awb.trim());
    if (!awb.trim() || !isValidFormat) {
      setAwbError("Please enter a valid AWB number.\nExample: AWB001");
      return;
    }
    
    setAwbError("");
    setLoading(true);

    const response = await fetch(`/api/tracking?awb=${awb}`);
    const data = await response.json();
    setLoading(false);

    if (data.found) {
      setShipment(data.shipment);
      setStatus("found");
    } else {
      setStatus("notfound");
      setShipment(null);
      // Redirect to the dedicated not-found page
      router.push(`/tracking/not-found?awb=${encodeURIComponent(awb)}`);
    }
  };

  const trackingSteps = ["Received", "Sortation", "Loaded", "Departed", "Arrived"];

  const getNormalizedStepIndex = (statusStr: string) => {
    const norm = (statusStr || "").trim().toUpperCase();
    if (norm === "RECEIVED" || norm === "DIPROSES") return 0;
    if (norm === "SORTATION") return 1;
    if (norm === "LOADED") return 2;
    if (norm === "DEPARTED" || norm === "DALAM PENGIRIMAN" || norm === "ON BOARD") return 3;
    if (norm === "ARRIVED" || norm === "SELESAI" || norm === "SAMPAI TUJUAN") return 4;
    if (norm === "DELAYED" || norm === "PENDING") return 3;
    return 0;
  };

  const currentStep = getNormalizedStepIndex(shipment?.shipping_status);

  const flightId = shipment
    ? `SL-${String(shipment.id || "001").padStart(3, "0")}`
    : null;

  const createdTs = formatTimestamp(shipment?.created_at);
  const updatedTs = formatTimestamp(shipment?.updated_at);

  return (
    <DashboardLayout>

      {/* ============================================================ */}
      {/* AWB SEARCH — appears FIRST                                   */}
      {/* ============================================================ */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          Track Your Shipment
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${awbError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-blue-500'} transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              value={awb}
              onChange={(e) => {
                setAwb(e.target.value);
                if (awbError) setAwbError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="Search tracking number..."
              className={`w-full h-14 pl-12 pr-4 bg-white border rounded-2xl shadow-sm font-medium transition-all duration-200 hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 ${
                awbError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 text-red-900 placeholder-red-300' 
                  : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={loading}
            className="h-14 sm:w-auto w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 rounded-2xl font-bold tracking-wide transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Tracking..." : "Track Shipment"}
          </button>
        </div>

        {awbError && (
          <div className="text-red-500 font-medium mt-2 flex items-start gap-2 text-sm whitespace-pre-line">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{awbError}</span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LIVE FLIGHT RADAR MAP — appears BELOW search                 */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-slate-200">

        {/* Radar Header Bar */}
        <div className="bg-slate-50 px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200">
          {/* Title */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-800 font-bold text-sm tracking-widest uppercase">
              Sky Link Live Radar
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-orange-500 font-bold text-sm">✈</span>
              <span>Active Flights:</span>
              <span className="text-slate-800 font-bold">{totalFlights}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-blue-500 font-bold text-sm">🏢</span>
              <span>Airports:</span>
              <span className="text-slate-800 font-bold">{TOTAL_AIRPORTS}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-emerald-500 font-bold text-sm">📦</span>
              <span>Tracking:</span>
              <span className={`font-bold ${flightId ? "text-orange-500" : "text-slate-400"}`}>
                {flightId || "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-purple-500 font-bold text-sm">🕒</span>
              <span className="text-slate-800 font-mono">{clock}</span>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="h-64 sm:h-80 md:h-[400px] w-full relative">
          <TrackingMap shipment={status === "found" ? shipment : null} />

          {/* Map Legend overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-200 shadow-sm pointer-events-none">
            <div className="text-[10px] text-slate-600 font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-sm">✈</span>
                <span>Active cargo aircraft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 bg-orange-500 opacity-80" />
                <span>Flown distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-slate-400" />
                <span>Remaining route</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SHIPMENT INFO + TIMELINE                                     */}
      {/* ============================================================ */}
      {status === "found" && shipment && (
        <div className="space-y-6 animate-fadeIn">

          {/* SHIPMENT INFO */}
          <div className="bg-white p-8 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Shipment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
              <div className="space-y-6">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">AWB Number</span>
                  <span className="font-bold text-slate-900 text-xl tracking-tight">{shipment.awb}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Flight ID</span>
                  <span className="font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-md inline-block">{flightId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Price</span>
                  <span className="font-bold text-slate-900 text-lg">Rp {Number(shipment.price).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative pl-6 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-px before:bg-slate-200">
                  <span className="absolute left-[3px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-300 bg-white"></span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Origin / Sender</span>
                  <span className="font-bold text-slate-800 text-base block">{shipment.origin_city}</span>
                  {shipment.origin_lat && <span className="text-slate-500 font-mono text-xs block mb-1">{Number(shipment.origin_lat).toFixed(4)}°, {Number(shipment.origin_lng).toFixed(4)}°</span>}
                  <span className="text-slate-500 font-medium">{shipment.sender_name}</span>
                </div>
                <div className="relative pl-6">
                  <span className="absolute left-[3px] top-1.5 w-3 h-3 rounded-full border-2 border-blue-500 bg-white"></span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Destination / Receiver</span>
                  <span className="font-bold text-slate-800 text-base block">{shipment.destination_city}</span>
                  {shipment.dest_lat && <span className="text-slate-500 font-mono text-xs block mb-1">{Number(shipment.dest_lat).toFixed(4)}°, {Number(shipment.dest_lng).toFixed(4)}°</span>}
                  <span className="text-slate-500 font-medium">{shipment.receiver_name}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Item Details</span>
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-slate-50 rounded-lg text-slate-600 font-bold">{shipment.weight} kg</span>
                    <span className="font-semibold text-slate-700">{shipment.item_type}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Service Type</span>
                  <span className="font-bold text-slate-800 uppercase tracking-wide bg-slate-100 px-3 py-1 rounded-md inline-block">{shipment.shipping_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">Current Status</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${
                    shipment.shipping_status === "Arrived" || shipment.shipping_status === "Selesai"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : shipment.shipping_status === "Delayed" || shipment.shipping_status === "Pending"
                      ? "bg-red-50 text-red-700 ring-1 ring-red-600/20 animate-pulse"
                      : "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                  }`}>{shipment.shipping_status}</span>
                </div>
              </div>
            </div>

            {/* TIMESTAMP SECTION */}
            {(createdTs || updatedTs) && (
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {createdTs && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Created At</p>
                      <p className="font-bold text-slate-800">{createdTs.date}</p>
                      <p className="text-sm text-slate-500 font-semibold font-mono">{createdTs.time}</p>
                    </div>
                  </div>
                )}
                {updatedTs && (
                  <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-orange-200 text-orange-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-0.5">Last Updated</p>
                      <p className="font-bold text-slate-800">{updatedTs.date}</p>
                      <p className="text-sm text-orange-600 font-semibold font-mono">{updatedTs.time}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TRACKING TIMELINE */}
          <div className="bg-white p-8 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 transition-all hover:shadow-lg">
            <h2 className="text-xl font-bold mb-8 text-slate-800 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Tracking Timeline
            </h2>

            <div className="relative ml-4">
              {trackingSteps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;
                const isFuture = index > currentStep;
                const isDelayed =
                  (shipment.shipping_status === "Delayed" || shipment.shipping_status === "Pending") && isActive;

                let iconHtml;
                let textClass;

                if (isCompleted) {
                  iconHtml = (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-100 flex items-center justify-center text-white text-xs z-10 shadow font-bold">
                      ✓
                    </div>
                  );
                  textClass = "text-emerald-700 font-bold";
                } else if (isActive) {
                  if (isDelayed) {
                    iconHtml = (
                      <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-red-100 flex items-center justify-center text-white text-xs z-10 shadow font-extrabold animate-pulse">
                        ⚠️
                      </div>
                    );
                    textClass = "text-red-600 font-extrabold";
                  } else {
                    iconHtml = (
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-100 flex items-center justify-center text-white text-xs z-10 shadow-lg shadow-blue-500/40 font-bold relative">
                          ➜
                        </div>
                        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                      </div>
                    );
                    textClass = "text-blue-700 font-extrabold";
                  }
                } else {
                  iconHtml = (
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-100 flex items-center justify-center text-slate-400 text-xs z-10 shadow-inner">
                      ○
                    </div>
                  );
                  textClass = "text-slate-400 font-medium";
                }

                return (
                  <div key={index} className="flex items-start gap-6 relative mb-10 last:mb-0">
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-[calc(100%+8px)] -translate-x-1/2 z-0 ${
                          index < currentStep ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}

                    {iconHtml}

                    <div className="pt-0.5">
                      <p className={`text-base ${textClass}`}>
                        {isActive && isDelayed ? "Delayed (In Transit)" : step}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isCompleted && "Step completed"}
                        {isActive && !isDelayed && "Current shipment status"}
                        {isActive && isDelayed && "Cargo transit temporarily delayed"}
                        {isFuture && "Awaiting flight progression"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
