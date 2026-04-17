"use client";

import Navbar from "../ui/navbar";
import Image from "next/image";

export default function About() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0b1f3a] to-[#020617]"></div>
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[150px]"></div>

      <Navbar />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24">

        <div className="space-y-6 max-w-2xl">

          {/* TITLE */}
          <h1 className="text-5xl font-bold animate-fadeInUp">
            About Sky Link
          </h1>

          {/* LINE */}
          <div className="w-24 h-[2px] bg-orange-400 mx-auto animate-fadeInUp delay-1"></div>

          {/* TEXT */}
          <p className="text-gray-300 animate-fadeInUp delay-2">
            Sky Link adalah platform modern untuk pengelolaan kargo udara
            yang memungkinkan tracking real-time, efisiensi operasional,
            dan transparansi pengiriman.
          </p>

          {/* ===== LOGO (RAPI & PROPORSIONAL) ===== */}
         <div className="flex justify-center animate-fadeInUp delay-3">
  <div
    className="bg-white 
    w-[180px] h-[90px] 
    rounded-full 
    overflow-hidden 
    flex items-center justify-center
    shadow-md"
  >
    <img
      src="/bg_profil.png"
      alt="logo"
      className="w-[115%] h-[115%] object-cover"
    />
  </div>
</div>

        </div>

      </div>

    </main>
  );
}