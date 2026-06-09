"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Load Leaflet map client-side only (Leaflet requires window)
const TrackingMap = dynamic(() => import("../ui/tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading radar...</div>
    </div>
  ),
});

// =====================================================================
// RADAR STATS — Fetched dynamically
// =====================================================================
const TOTAL_AIRPORTS = 11;

export default function Tracking() {

  const [awb, setAwb] = useState("");

  const [status, setStatus] =
    useState<"idle" | "found" | "notfound">("idle");

  const [shipment, setShipment] = useState<any>(null);

  const [clock, setClock] = useState("");

  const [awbError, setAwbError] = useState("");
  const [totalFlights, setTotalFlights] = useState(8);

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
          // Increase aircraft count based on real shipments
          setTotalFlights(8 + data.length);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleTrack = async () => {
    if (!awb.trim()) {
      setAwbError("Please enter a tracking number.");
      return;
    }
    setAwbError("");

    const response = await fetch(`/api/tracking?awb=${awb}`);
    const data = await response.json();

    if (data.found) {
      setShipment(data.shipment);
      setStatus("found");
    } else {
      setStatus("notfound");
      setShipment(null);
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

  // Derive a flight number from shipment if available
  const flightId = shipment
    ? `SL-${String(shipment.id || "001").padStart(3, "0")}`
    : null;

  return (
    <DashboardLayout>

      {/* ============================================================ */}
      {/* LIVE FLIGHT RADAR MAP                                        */}
      {/* ============================================================ */}
      <div className="bg-slate-950 rounded-2xl shadow-2xl overflow-hidden mb-6 border border-slate-800">

        {/* Radar Header Bar */}
        <div className="bg-slate-900 px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-800">
          {/* Title */}
          <div className="flex items-center gap-2 mr-auto">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-bold text-sm tracking-widest uppercase">
              Sky Link Live Radar
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-orange-400 font-bold text-sm">✈</span>
              <span>Active Flights:</span>
              <span className="text-white font-bold">{totalFlights}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-blue-400 font-bold text-sm">🏢</span>
              <span>Airports:</span>
              <span className="text-white font-bold">{TOTAL_AIRPORTS}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-emerald-400 font-bold text-sm">📦</span>
              <span>Tracking:</span>
              <span className={`font-bold ${flightId ? "text-orange-400" : "text-slate-500"}`}>
                {flightId || "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-purple-400 font-bold text-sm">🕒</span>
              <span className="text-white font-mono">{clock}</span>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="h-64 sm:h-80 md:h-[460px] w-full relative">
          <TrackingMap shipment={status === "found" ? shipment : null} />

          {/* Map Legend overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700 pointer-events-none">
            <div className="text-[10px] text-slate-400 font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-sm">✈</span>
                <span>Active cargo aircraft</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 bg-orange-500 opacity-80" />
                <span>Flown distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-slate-500" />
                <span>Remaining route</span>
              </div>
            </div>
          </div>

          {/* Status overlays */}
          {status === "notfound" && (
            <div className="absolute inset-0 z-[1001] flex items-center justify-center pointer-events-none">
              <div className="bg-slate-900/95 border border-red-500/40 rounded-2xl px-8 py-5 text-center shadow-2xl">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-red-400 font-bold text-base">AWB Not Found</div>
                <div className="text-slate-500 text-xs mt-1">Enter a valid AWB to highlight the route</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* AWB SEARCH                                                   */}
      {/* ============================================================ */}
      <div className={`bg-white p-2 rounded-2xl shadow-md flex gap-2 border max-w-4xl mx-auto transition-all ${
        awbError 
          ? 'border-red-500 ring-4 ring-red-500/20 mb-2' 
          : 'border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 mb-8'
      }`}>
        <div className={`pl-6 pr-2 py-4 flex items-center ${awbError ? 'text-red-400' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          value={awb}
          onChange={(e) => {
            setAwb(e.target.value);
            if (awbError) setAwbError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          placeholder="Enter AWB number to track your shipment..."
          className={`flex-1 bg-transparent p-4 outline-none font-semibold text-lg placeholder:font-normal ${
            awbError ? 'text-red-500 placeholder:text-red-300' : 'text-slate-800 placeholder:text-slate-400'
          }`}
        />
        <button
          onClick={handleTrack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl font-bold tracking-wide transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 m-1"
        >
          Track Shipment
        </button>
      </div>

      {awbError && (
        <div className="text-center text-red-500 font-medium mb-8 animate-fadeIn">
          {awbError}
        </div>
      )}

      {/* ============================================================ */}
      {/* SHIPMENT INFO + TIMELINE                                     */}
      {/* ============================================================ */}
      {status === "found" && shipment && (
        <div className="space-y-6 animate-fadeIn">

          {/* SHIPMENT INFO */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-blue-50 rounded-lg text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
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
                  <span className="font-bold text-slate-900 text-lg">Rp {shipment.price.toLocaleString("id-ID")}</span>
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
          </div>

          {/* TRACKING TIMELINE */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-8 text-slate-800 flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-purple-50 rounded-lg text-purple-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
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
                      <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-100 flex items-center justify-center text-white text-xs z-10 shadow font-bold">
                        ➜
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
