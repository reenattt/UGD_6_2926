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
    <main className="w-full overflow-x-hidden m-0 p-0 scroll-smooth">

      {/* ================= HOME ================= */}
      <section id="home" className="relative min-h-screen w-full">

        {/* VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/WP1.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent"></div>

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 py-6 text-white z-50">
          <div className="flex justify-center gap-12 text-xl font-semibold">
            {[
              { name: "Home", id: "home" },
              { name: "About Us", id: "about" },
              { name: "Contact", id: "contact" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.id)}
                className={`relative ${
                  active === item.id
                    ? "text-orange-400"
                    : "text-white hover:text-orange-300"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-2 h-[3px] bg-orange-500 ${
                    active === item.id ? "w-full" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* LOGO */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white relative">
              <Image src="/bg_profil.png" alt="logo" fill className="object-cover" />
            </div>
            <span>Sky Link</span>
          </div>
        </nav>

        {/* HERO */}
        <div className="relative z-10 flex items-center min-h-screen px-20 text-white">
          <div className="max-w-2xl space-y-8">

            <h1 className="text-7xl font-extrabold">
              Sky Link <span className="text-orange-400">Air Cargo</span>
            </h1>

            <p className="text-lg text-gray-200">
              Platform modern untuk pengelolaan kargo udara dengan sistem real-time tracking,
              Solusi anda untuk pengelolaan kargo udara yang cepat,akurat, dan realtime tracking utuk Operasional modern.
            </p>

            <button
              onClick={() => setShowLogin(true)}
              className="bg-orange-500 px-8 py-4 rounded-full hover:scale-110 transition shadow-lg"
            >
              Get Started
            </button>

          </div>
        </div>

      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="min-h-screen bg-blue-950 text-white flex items-center px-32">

        <div className="grid md:grid-cols-2 gap-16 w-full items-center">

          {/* TEXT */}
          <div>
            <h2 className="text-5xl font-bold mb-6">
              Why Choose <span className="text-orange-400">Sky Link?</span>
            </h2>

            <p className="text-gray-300 mb-8">
              Solusi kargo udara modern dengan teknologi real-time dan sistem terpercaya.
            </p>

            <div className="space-y-4">
              {[
                "Real-Time Tracking",
                "Automated Notifications",
                "Cargo Insurance",
                "Airport Partnership",
              ].map((item) => (
                <div key={item} className="bg-white/10 p-4 rounded-lg">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* LOGO FIT */}
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full bg-white overflow-hidden relative shadow-2xl">
              <Image
                src="/bg_profil.png"
                alt="logo"
                fill
                className="object-cover p-6"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-black text-white flex items-center justify-center px-32"
      >
        <div className="text-center w-full">

          <h2 className="text-5xl font-bold mb-4">
            Contact <span className="text-orange-400">Sky Link</span>
          </h2>

          <p className="text-gray-300 mb-12">
            Kami siap membantu kebutuhan pengiriman Anda kapan saja
          </p>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                icon: "📞",
                title: "Contact",
                desc: "Hotline 24/7",
                value: "+62 1234567890",
              },
              {
                icon: "💬",
                title: "WhatsApp",
                desc: "Chat langsung",
                value: "+62 1234567890",
              },
              {
                icon: "✉️",
                title: "Email",
                desc: "Kerja sama bisnis",
                value: "skylink@gmail.com",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:scale-105 transition duration-300 cursor-pointer shadow-xl"
              >

                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-blue-800/20 transition"></div>

                <div className="relative z-10 flex flex-col items-center">

                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 text-3xl mb-4 group-hover:bg-orange-500 transition">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                  <p className="font-semibold">{item.value}</p>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= LOGIN ================= */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl w-96 text-white shadow-2xl">

            <h2 className="text-3xl font-bold mb-6 text-center">
              Welcome to Sky Link
            </h2>

            <input
              className="w-full mb-4 p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
              placeholder="Username"
            />

            <input
              type="password"
              className="w-full mb-6 p-3 rounded-lg bg-white/20 placeholder-white/70 outline-none"
              placeholder="Password"
            />

            <button className="w-full bg-orange-500 py-3 rounded-lg hover:scale-105 transition">
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