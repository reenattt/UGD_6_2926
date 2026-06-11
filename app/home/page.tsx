"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../ui/navbar";
import dynamic from "next/dynamic";

// Load Leaflet map client-side only (requires window)
const TrackingMap = dynamic(() => import("../ui/tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <span className="text-slate-400 text-xs animate-pulse">Loading map…</span>
    </div>
  ),
});

export default function Page() {

  const [awb, setAwb] = useState("");

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [awbError, setAwbError] = useState("");
  const [totalFlights, setTotalFlights] = useState(8);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();

  const handleTrack = async () => {

    if (loading) return;

    if (!awb.trim() || !/^AWB\d{3,}$/i.test(awb.trim())) {
      setAwbError("Please enter a valid AWB number. Example: AWB001");
      setResult(null);
      return;
    }

    setAwbError("");
    setLoading(true);

    try {

      const res = await fetch(
        `/api/tracking?awb=${awb}`
      );

      const data = await res.json();

      if (data.found) {

        setResult(data.shipment);

        // SCROLL KE BAWAH
        setTimeout(() => {

          document
            .getElementById("tracking-result")
            ?.scrollIntoView({
              behavior: "smooth",
            });

        }, 200);

      } else {
        setResult(null);
        router.push(`/tracking-not-found?awb=${encodeURIComponent(awb)}`);
      }

    } catch (error) {
      console.log(error);
      setResult(null);
      router.push(`/tracking-not-found?awb=${encodeURIComponent(awb)}`);
    }

    setLoading(false);

  };

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/company-info");
    }, 250);
  };

  // ================= STATUS COLOR =================

  const getStatusColor = (status: string) => {

    switch (status) {

      case "Received":
        return "bg-blue-100 text-blue-700";

      case "Sortation":
        return "bg-yellow-100 text-yellow-700";

      case "Loaded":
        return "bg-purple-100 text-purple-700";

      case "Departed":
        return "bg-cyan-100 text-cyan-700";

      case "Arrived":
        return "bg-green-100 text-green-700";

      case "Delayed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  return (

    <main className={`min-h-screen w-full text-white relative overflow-x-hidden transition-all duration-300 ease-out ${isNavigating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

      {/* NAVBAR */}

      <Navbar />

      {/* BACKGROUND VIDEO */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-screen object-cover"
      >
        <source src="/WP4.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#132868]/90 via-[#132868]/50 to-transparent"></div>

      {/* HERO */}

      <section className="relative z-10 min-h-screen flex items-center justify-between px-20 py-10 gap-10">

        {/* LEFT */}

        <div className="space-y-8 max-w-[650px]">

          {/* STATUS BADGE */}
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-black/40 transition-colors duration-300 cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium tracking-wide text-gray-200">Live Tracking System Active</span>
          </div>

          <h1 className="text-6xl font-bold leading-tight">

            Sky Link

            <span className="text-orange-400">
              {" "}
              Air Cargo
            </span>

          </h1>

          <p className="text-gray-200 text-xl leading-relaxed max-w-[600px]">

            Platform modern untuk pengelolaan cargo udara dengan
            sistem tracking realtime yang terintegrasi langsung
            dengan database dan monitoring pengiriman.

          </p>

          <div className="flex gap-4">

            {/* GET STARTED */}

            <button
              onClick={handleGetStarted}
              className="bg-orange-500 px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1"
            >
              Get Started
            </button>

          </div>

          {/* LOGISTICS STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 mt-8 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">50+</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Countries<br/>Connected</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">12K+</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Shipments<br/>Processed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">32</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Active<br/>Aircraft</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">99%</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Delivery<br/>Success</span>
            </div>
          </div>

        </div>

        {/* RIGHT */}

        <div className="w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-white/5 transition-all duration-300 hover:shadow-blue-900/20 hover:border-white/30 group">

          {/* LIVE FLIGHT MAP */}

          <div className="h-56 w-full overflow-hidden relative border-b border-white/10">
            <TrackingMap compact shipment={result && typeof result === "object" ? result : null} />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Global Radar</span>
            </div>
          </div>

          {/* TRACKING */}

          <div className="p-8 backdrop-blur-2xl bg-black/40">

            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-white">
                Track Shipment
              </h2>
              <span className="text-xs font-medium text-orange-400 mb-1 tracking-wide">Available 24/7</span>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 text-[11px] mb-1.5 uppercase tracking-widest font-semibold">Example Tracking Number:</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono text-gray-300">AWB001</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="font-mono text-gray-300">AWB015</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="font-mono text-gray-300">AWB125</span>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="relative group/input"
            >
              <input
                value={awb}
                onChange={(e) => {
                  setAwb(e.target.value);
                  if (awbError) setAwbError("");
                }}
                placeholder="Enter AWB Number"
                className={`w-full pl-5 pr-12 py-4 rounded-xl bg-white/10 border text-white placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white/20 ${
                  awbError 
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "border-white/10 hover:border-white/30 focus:border-orange-400"
                }`}
              />
              <svg className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${awbError ? "text-red-400" : "text-gray-400 group-focus-within/input:text-orange-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {awbError && (
              <div className="flex items-center gap-2 mt-3 text-red-400">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-medium">{awbError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleTrack}
              disabled={loading}
              className="w-full bg-orange-500 py-4 mt-6 rounded-xl font-bold text-white hover:bg-orange-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >

              {loading ? "Tracking..." : "Track Shipment"}

            </button>

          </div>

        </div>

      </section>

      {/* RESULT SECTION */}

      {result && typeof result === "object" && (

        <section
          id="tracking-result"
          className="relative z-10 bg-[#0f172a] px-20 py-24"
        >

          <div className="max-w-5xl mx-auto">

            <h2 className="text-5xl font-bold mb-14 text-center">

              Tracking{" "}

              <span className="text-orange-400">
                Result
              </span>

            </h2>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">

              {/* HEADER */}

              <div className="flex justify-between items-center mb-10">

                <div>

                  <p className="text-gray-300 text-sm">
                    AWB Number
                  </p>

                  <h2 className="font-bold text-4xl">
                    {result.awb}
                  </h2>

                </div>

                <span
                  className={`px-5 py-3 rounded-full text-sm font-semibold ${getStatusColor(result.shipping_status)}`}
                >

                  {result.shipping_status}

                </span>

              </div>

              {/* DATA */}

              <div className="grid md:grid-cols-2 gap-8 text-lg">

                <div>

                  <p className="text-gray-400 mb-1">
                    Sender
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.sender_name}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Receiver
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.receiver_name}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Origin Airport
                  </p>

                  <p className="font-medium text-xl text-blue-400">
                    {result.origin_city}
                  </p>
                  
                  {result.origin_lat && (
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {(Number(result.origin_lat) || 0).toFixed(4)}°, {(Number(result.origin_lng) || 0).toFixed(4)}°
                    </p>
                  )}

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Destination Airport
                  </p>

                  <p className="font-medium text-xl text-orange-400">
                    {result.destination_city}
                  </p>
                  
                  {result.dest_lat && (
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {(Number(result.dest_lat) || 0).toFixed(4)}°, {(Number(result.dest_lng) || 0).toFixed(4)}°
                    </p>
                  )}

                </div>
                
                <div className="md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-gray-400 mb-2 text-sm uppercase tracking-wider font-bold">
                    Flight Route
                  </p>
                  <div className="flex items-center gap-4 text-2xl font-bold">
                    <span className="text-blue-400">{result.origin_city}</span>
                    <div className="flex-1 border-t-2 border-dashed border-gray-600 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] px-2 text-gray-400">
                         ✈
                       </div>
                    </div>
                    <span className="text-orange-400">{result.destination_city}</span>
                  </div>
                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Weight
                  </p>

                  <p className="font-medium text-xl">
                    {result.weight} kg
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Flight ID
                  </p>

                  <p className="font-medium text-xl">
                    {result.flight_id}
                  </p>

                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-400 mb-1 text-sm uppercase tracking-wider font-bold">
                      Created At
                    </p>
                    {result.created_at ? (
                      <>
                        <p className="font-semibold text-lg text-white">
                          {new Date(result.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-gray-400 text-sm font-mono mt-0.5">
                          {new Date(result.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":")} WIB
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">—</p>
                    )}
                  </div>
                  <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                    <p className="text-orange-400 mb-1 text-sm uppercase tracking-wider font-bold">
                      Last Updated
                    </p>
                    {result.updated_at ? (
                      <>
                        <p className="font-semibold text-lg text-white">
                          {new Date(result.updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-orange-400/80 text-sm font-mono mt-0.5">
                          {new Date(result.updated_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":")} WIB
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">—</p>
                    )}
                  </div>
                </div>

              </div>

              {/* FOOTER */}

              <div className="border-t border-white/10 mt-10 pt-8 flex justify-between items-center">

                <div>

                  <p className="text-gray-400 text-sm">
                    Shipping Price
                  </p>

                  <h2 className="text-orange-400 text-4xl font-bold">

                    Rp
                    {(Number(result.price) || 0).toLocaleString("id-ID")}

                  </h2>

                </div>

                <div className="text-right">

                  <p className="text-gray-400 text-sm">
                    Shipping Type
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.shipping_type}
                  </p>

                </div>
              </div>
            </div>

          </div>
        </section>

      )}

    </main>

  );

}