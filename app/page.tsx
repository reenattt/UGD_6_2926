"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden">

      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-125"
      >
        <source src="/WP1.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40"></div>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center pt-16 bg-white/5 backdrop-blur-md z-40 border-r border-white/10">

        <div
          onClick={() => setShowLogin(true)}
          className="flex flex-col items-center gap-2 cursor-pointer hover:scale-110 transition"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            👤
          </div>
          <span className="text-white text-sm">User</span>
        </div>

      </aside>

      {/* NAVBAR */}
      <nav className="fixed top-6 left-24 right-0 py-6 text-white z-50">

        <div className="flex justify-center gap-12 text-xl font-semibold">
          {["Dashboard", "Tracking AWB", "Shipments", "Flight Status"].map((item) => (
            <a
              key={item}
              className="relative group cursor-pointer transition hover:scale-110 hover:text-orange-400"
            >
              {item}
              <span className="absolute left-0 -bottom-2 w-0 h-[3px] bg-orange-500 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* LOGO */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <Image src="/wp1.jpeg" alt="logo" width={40} height={40} />
          </div>
          <span className="font-semibold">Go Fly</span>
        </div>

      </nav>

      {/* HERO */}
      <div className="relative z-10 flex items-center justify-between h-full pl-32 pr-20 text-white">

        {/* LEFT */}
        <div className="max-w-xl space-y-6">

          <h1 className="text-6xl font-bold leading-tight">
            Go Fly Air Cargo
          </h1>

          <p className="text-gray-200">
            Solusi digital untuk pengelolaan kargo udara yang cepat,
            akurat, dan real-time tracking untuk operasional modern.
          </p>

          <div className="flex gap-4">

            <Link
              href="#"
              className="bg-orange-500 px-6 py-3 rounded-full hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              href="#"
              className="bg-white/20 px-6 py-3 rounded-full hover:scale-105 transition"
            >
              Track Shipment
            </Link>

          </div>

          {/* STATS */}
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-xl font-bold">10K+</p>
              <p className="text-sm">Shipments</p>
            </div>
            <div>
              <p className="text-xl font-bold">98%</p>
              <p className="text-sm">On-Time</p>
            </div>
            <div>
              <p className="text-xl font-bold">24/7</p>
              <p className="text-sm">Support</p>
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          <div className="bg-green-500 px-5 py-2 rounded-full text-sm animate-pulse">
            ● System Online
          </div>

          <div className="bg-white text-gray-800 p-6 rounded-xl w-80 shadow-xl">
            <h3 className="font-semibold mb-3">System Performance</h3>

            <div className="flex justify-between">
              <span>Total</span>
              <span>12,450</span>
            </div>

            <div className="flex justify-between">
              <span>On-Time</span>
              <span className="text-green-600">98%</span>
            </div>

            <div className="flex justify-between">
              <span>Flights</span>
              <span>320</span>
            </div>

            <div className="text-center mt-4 text-blue-600 font-bold text-2xl">
              4.8 ★
            </div>
          </div>

          <div className="bg-white text-gray-800 p-4 rounded-xl w-80 shadow">
            <h4 className="font-semibold mb-2">Live Tracking</h4>

            <div className="flex justify-between text-sm">
              <span>AWB</span>
              <span>GF-78291</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Status</span>
              <span className="text-blue-600">In Transit</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Dest</span>
              <span>Singapore</span>
            </div>
          </div>

        </div>

      </div>

      {/* LOGIN */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-72">

            <h2 className="text-lg font-bold mb-4 text-center">Login</h2>

            <input className="w-full mb-2 p-2 border rounded" placeholder="Username" />
            <input className="w-full mb-3 p-2 border rounded" placeholder="Password" />

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:scale-105 transition">
              Login
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </main>
  );
}