"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../ui/navbar";
import dynamic from "next/dynamic";

// Load Leaflet map client-side only (requires window)
const TrackingMap = dynamic(() => import("../ui/tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <span className="text-slate-500 text-xs animate-pulse">Loading map…</span>
    </div>
  ),
});

export default function Page() {

  const [awb, setAwb] = useState("");

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [awbError, setAwbError] = useState("");

  const router = useRouter();

  const handleTrack = async () => {

    if (!awb.trim()) {
      setAwbError("AWB number cannot be empty");
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

        setResult(false);

      }

    } catch (error) {

      console.log(error);

      setResult(false);

    }

    setLoading(false);

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

    <main className="min-h-screen w-full text-white relative overflow-x-hidden">

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

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#132868]/90 via-[#132868]/50 to-transparent"></div>

      {/* HERO */}

      <section className="relative z-10 min-h-screen flex items-center justify-between px-20 py-10 gap-10">

        {/* LEFT */}

        <div className="space-y-8 max-w-[650px]">

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
              onClick={() => router.push("/company-info")}
              className="bg-orange-500 px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition hover:scale-105"
            >
              Get Started
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10">

          {/* LIVE FLIGHT MAP */}

          <div className="h-56 w-full overflow-hidden relative">
            <TrackingMap compact shipment={result && result !== false ? result : null} />
          </div>

          {/* TRACKING */}

          <div className="p-6 backdrop-blur-xl bg-black/30">

            <h2 className="text-2xl font-bold mb-5">
              Track Shipment
            </h2>

            <input
              value={awb}
              onChange={(e) => {
                setAwb(e.target.value);
                if (awbError) setAwbError("");
              }}
              placeholder="Enter AWB Number"
              className={`w-full px-4 py-4 rounded-xl text-black mb-4 outline-none ${
                awbError ? "border-2 border-red-500" : ""
              }`}
            />

            {awbError && (
              <p className="text-red-400 text-xs -mt-2 mb-4 font-medium">
                {awbError}
              </p>
            )}

            <button
              onClick={handleTrack}
              className="w-full bg-orange-500 py-4 rounded-xl font-semibold hover:bg-orange-600 transition hover:scale-[1.02]"
            >

              {loading ? "Tracking..." : "Track Shipment"}

            </button>

          </div>

        </div>

      </section>

      {/* RESULT SECTION */}

      {result && (

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
                    Origin
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.origin_city}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Destination
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.destination_city}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Item Type
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.item_type}
                  </p>

                </div>

                <div>

                  <p className="text-gray-400 mb-1">
                    Weight
                  </p>

                  <p className="font-semibold text-2xl">
                    {result.weight} Kg
                  </p>

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
                    {Number(result.price).toLocaleString("id-ID")}

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