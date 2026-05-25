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

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ================= LOGIN =================

  const handleLogin = () => {

    if (
      username === "241712926" &&
      password === "hajarsiweb"
    ) {

      router.push("/dashboard");

    } else {

      alert("Username atau Password salah");

    }

  };

  // ================= TRACKING =================

  const handleTrack = async () => {

    if (!awb) return;

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

      <div className="absolute inset-0 bg-black/55"></div>

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
              onClick={() => setShowLogin(true)}
              className="bg-orange-500 px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition hover:scale-105"
            >
              Get Started
            </button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10">

          {/* MAP */}

          <div className="h-56 w-full">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.49149349704!2d106.664701498253!3d-6.229728024631306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1c987ddf74f%3A0x301576d14feb9e0!2sJakarta!5e0!3m2!1sid!2sid!4v1716576400000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>

          </div>

          {/* TRACKING */}

          <div className="p-6 backdrop-blur-xl bg-black/30">

            <h2 className="text-2xl font-bold mb-5">
              Track Shipment
            </h2>

            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="Enter AWB Number"
              className="w-full px-4 py-4 rounded-xl text-black mb-4 outline-none"
            />

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

      {/* LOGIN MODAL */}

      {showLogin && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-[#1b1b1b]/90 border border-white/10 rounded-3xl p-8 w-[420px] text-white shadow-2xl">

            {/* LOGO */}

            <div className="flex justify-center mb-6">

              <img
                src="/bg_profil.png"
                alt="logo"
                className="w-20 h-20 rounded-full bg-white p-2"
              />

            </div>

            <h2 className="text-3xl font-bold mb-6 text-center">

              Login

            </h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white text-black p-4 rounded-xl mb-4 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-black p-4 rounded-xl mb-6 outline-none"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Login
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-4 text-gray-300 hover:text-white transition"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </main>

  );

}