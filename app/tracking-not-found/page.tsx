"use client";

import Navbar from "../ui/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PublicNotFoundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const awb = searchParams.get("awb");

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">

        {/* SVG Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center shadow-inner border border-white/10">
              <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Floating X badge */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#132868]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
          Shipment Not Found
        </h1>
        <p className="text-gray-300 text-base leading-relaxed mb-4">
          The tracking number you entered does not exist in our system.
        </p>

        {awb && (
          <div className="bg-white/5 rounded-xl py-3 px-6 inline-block mb-6 border border-white/10">
            <span className="text-gray-400 text-sm font-medium mr-2">Searched AWB:</span>
            <span className="text-white font-mono font-bold text-xl">{awb}</span>
          </div>
        )}

        <p className="text-gray-400 text-sm mb-8">
          Please check that your AWB number is correct and try again.
        </p>

        {/* Hint box */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-5 py-4 mb-8 text-left">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Tip</p>
          <p className="text-orange-100/80 text-sm">
            AWB numbers follow the format <span className="font-mono font-bold text-white">AWB001</span>,{" "}
            <span className="font-mono font-bold text-white">AWB015</span>,{" "}
            <span className="font-mono font-bold text-white">AWB125</span>, etc.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => router.push("/home")}
            className="w-full sm:w-64 px-8 py-4 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 text-lg tracking-wide"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PublicTrackingNotFound() {
  return (
    <main className="min-h-screen w-full text-white relative overflow-x-hidden bg-[#0f172a]">
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#132868]/95 via-[#132868]/80 to-[#132868]/90"></div>

      <Suspense fallback={<div className="relative z-10 min-h-screen flex items-center justify-center"><div className="text-white/50 animate-pulse">Loading...</div></div>}>
        <PublicNotFoundContent />
      </Suspense>
    </main>
  );
}
