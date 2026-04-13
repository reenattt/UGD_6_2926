"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  const [active, setActive] = useState("home");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "contact"];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActive(id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="w-full overflow-x-hidden scroll-smooth">

      {/* ================= HOME ================= */}
      <section id="home" className="relative h-screen w-full">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
        >
          <source src="/WP1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

        {/* NAVBAR */}
        <nav className="fixed top-6 left-0 right-0 py-6 text-white z-50">
          <div className="flex justify-center gap-12 text-xl font-semibold">
            {[
              { name: "Home", id: "home" },
              { name: "About Us", id: "about" },
              { name: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.id)}
                className={`relative transition ${
                  active === item.id
                    ? "text-orange-400"
                    : "text-white hover:text-orange-300"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-2 h-[3px] bg-orange-500 transition-all ${
                    active === item.id ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* LOGO */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <Image src="/wp1.jpeg" alt="logo" width={40} height={40} />
            </div>
            <span className="font-semibold">Sky Link</span>
          </div>
        </nav>

        {/* HERO */}
        <div className="relative z-10 flex items-center h-full px-20 text-white">

          <div className="max-w-2xl space-y-8">

            <h1 className="text-7xl font-extrabold leading-tight">
              Sky Link <span className="text-orange-400">Air Cargo</span>
            </h1>

            <p className="text-lg text-gray-200">
              Platform modern untuk pengelolaan kargo udara dengan sistem real-time tracking,
              performa tinggi, dan keandalan global.
            </p>

            <div className="flex gap-6">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-orange-500 text-lg px-8 py-4 rounded-full hover:scale-110 transition shadow-lg shadow-orange-500/30"
              >
                Get Started
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-blue-900 transition"
              >
                Learn More
              </button>
            </div>

            <div className="flex gap-10 pt-6">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-gray-300">Shipments</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-gray-300">On-Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-gray-300">Support</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white flex items-center px-32">

        <div className="grid md:grid-cols-2 gap-16 items-center w-full">

          <div>
            <h2 className="text-5xl font-bold mb-6">
              Why Choose <span className="text-orange-400">Sky Link?</span>
            </h2>

            <p className="text-gray-300 mb-8">
              Sky Link menghadirkan solusi kargo udara modern dengan teknologi terbaru
              untuk memastikan pengiriman cepat, aman, dan transparan.
            </p>

            <div className="space-y-4">
              {[
                "Real-Time Tracking",
                "Automated Notifications",
                "Cargo Insurance",
                "Airport Partnership",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/10 p-4 rounded-lg backdrop-blur hover:bg-white/20 transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full bg-white flex items-center justify-center text-blue-900 font-bold text-xl shadow-xl">
              SKY LINK
            </div>
          </div>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="h-screen bg-blue-900 text-white flex items-center justify-center px-32">

        <div className="text-center w-full">
          <h2 className="text-5xl font-bold mb-12">Contact Sky Link</h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              { title: "Contact", value: "+62 1234567890" },
              { title: "WhatsApp", value: "+62 1234567890" },
              { title: "Email", value: "skylink@gmail.com" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 p-8 rounded-xl backdrop-blur hover:scale-105 hover:bg-white/20 transition duration-300 cursor-pointer"
              >
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p>{item.value}</p>
              </div>
            ))}

          </div>
        </div>

      </section>

      {/* ================= LOGIN ================= */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-10 rounded-3xl w-96 text-white shadow-2xl">

            <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Sky Link</h2>

            <input
              className="w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
              placeholder="Username"
            />

            <input
              type="password"
              className="w-full mb-6 p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
              placeholder="Password"
            />

            <button className="w-full bg-orange-500 py-3 rounded-lg text-lg hover:scale-105 transition shadow-lg">
              Login
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-4 text-sm text-gray-300"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </main>
  );
}