"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../ui/navbar";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [awb, setAwb] = useState("");
  const [result, setResult] = useState<any>(null);

  const router = useRouter();

  const dummyData = [
    { awb: "AWB-001", origin: "SUB", destination: "CGK", status: "Departed" },
    { awb: "AWB-002", origin: "CGK", destination: "SIN", status: "Loaded" },
    { awb: "AWB-003", origin: "CGK", destination: "KUL", status: "Sortation" },
    { awb: "AWB-004", origin: "BPN", destination: "HKG", status: "Arrived" },
    { awb: "AWB-005", origin: "MDC", destination: "BKK", status: "Delayed" },
  ];

  const handleLogin = () => {
    if (username === "241712926" && password === "hajarsiweb") {
      router.push("/dashboard");
    } else {
      alert("Username atau Password salah");
    }
  };

  const handleTrack = () => {
    const found = dummyData.find((item) => item.awb === awb);
    setResult(found || false);
  };

  return (
    <main className="h-screen w-full overflow-hidden text-white relative">

      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/WP4.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-blue-950/80"></div>

      {/* HERO */}
      <div className="relative z-10 flex items-center justify-between h-full px-20">

        {/* LEFT */}
        <div className="space-y-8 max-w-[600px] animate-fadeInUp">

          <h1 className="text-6xl font-bold">
            Sky Link <span className="text-orange-400">Air Cargo</span>
            </h1>

          <p className="text-gray-200 text-lg max-w-[500px]">
            Platform modern untuk pengelolaan kargo udara dengan sistem real-time tracking.
            Solusi cepat, akurat, dan efisien untuk operasional logistik modern.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-orange-500 px-10 py-4 rounded-full text-lg font-semibold 
            hover:bg-orange-600 hover:scale-105 transition"
          >
            Get Started
          </button>

        </div>

        {/* RIGHT TRACKING */}
        <div className="w-[420px] rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">

          {/* VIDEO HEADER */}
          <div className="h-44 w-full relative overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-[center_30%] scale-[1.1]"
            >
              <source src="/track.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          </div>

          {/* CONTENT */}
          <div className="glass p-6">

            <h2 className="text-xl font-semibold mb-4">
              Track Shipment
            </h2>

            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter AWB Number"
              className="w-full px-4 py-3 rounded-lg text-black mb-4"
            />

            <button
              onClick={handleTrack}
              className="w-full bg-orange-500 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Track
            </button>

            {result === false && (
              <p className="text-red-400 mt-4">
                AWB tidak ditemukan
              </p>
            )}

            {result && (
              <div className="mt-4 text-sm space-y-1">
                <p><b>{result.awb}</b></p>
                <p>{result.origin} → {result.destination}</p>
                <p>
                  Status:{" "}
                  <span className="text-orange-400 font-semibold">
                    {result.status}
                  </span>
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md">

          <div className="w-[400px] p-8 rounded-2xl 
          bg-white/10 backdrop-blur-xl border border-white/20 
          shadow-2xl animate-fadeIn text-center">

            {/* LOGO BULAT FIX */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
                <img
                  src="/bg_profil.png"
                  alt="SkyLink"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-6">
              Login
            </h2>

            {/* INPUT */}
            <div className="space-y-4 text-left">

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-black outline-none"
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 
              py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>

            {/* CLOSE */}
            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-4 text-sm text-gray-300 hover:text-white"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </main>
  );
}