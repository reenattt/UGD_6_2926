"use client";

import Navbar from "../ui/navbar";

export default function Contact() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[#1f2a5a]"></div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 300px at center, rgba(96,165,250,0.35) 0%, rgba(31,42,90,0.9) 60%, rgba(31,42,90,1) 80%)",
        }}
      ></div>

      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-10 pt-24">

        {/* TITLE */}
        <h1 className="text-4xl font-semibold mb-3 animate-fadeInUp">
          Contact <span className="text-orange-400 font-bold">Sky Link</span>
        </h1>

        <p className="text-gray-300 mb-10 animate-fadeInUp delay-1">
          Kami siap membantu kebutuhan pengiriman Anda kapan saja
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">

          {/* CARD 1 */}
          <div className="bg-[#2b3c73] p-6 rounded-xl text-center 
            animate-fadeInUp delay-1
            transition duration-300 
            hover:scale-105 hover:bg-[#324a8a] group cursor-pointer">

            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center 
              rounded-full bg-white/20 text-xl
              transition duration-300 group-hover:bg-orange-500 group-hover:shadow-lg group-hover:shadow-orange-500/30">
              📞
            </div>

            <h2 className="mb-1 font-semibold text-lg group-hover:text-orange-400 transition">
              Contact
            </h2>
            <p className="text-sm text-gray-300">Hotline 24/7</p>
            <p className="font-medium mt-1">+62 1234567890</p>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#2b3c73] p-6 rounded-xl text-center 
            animate-fadeInUp delay-2
            transition duration-300 
            hover:scale-105 hover:bg-[#324a8a] group cursor-pointer">

            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center 
              rounded-full bg-white/20 text-xl
              transition duration-300 group-hover:bg-orange-500 group-hover:shadow-lg group-hover:shadow-orange-500/30">
              💬
            </div>

            <h2 className="mb-1 font-semibold text-lg group-hover:text-orange-400 transition">
              WhatsApp
            </h2>
            <p className="text-sm text-gray-300">Chat langsung</p>
            <p className="font-medium mt-1">+62 1234567890</p>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#2b3c73] p-6 rounded-xl text-center 
            animate-fadeInUp delay-3
            transition duration-300 
            hover:scale-105 hover:bg-[#324a8a] group cursor-pointer">

            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center 
              rounded-full bg-white/20 text-xl
              transition duration-300 group-hover:bg-orange-500 group-hover:shadow-lg group-hover:shadow-orange-500/30">
              ✉️
            </div>

            <h2 className="mb-1 font-semibold text-lg group-hover:text-orange-400 transition">
              Email
            </h2>
            <p className="text-sm text-gray-300">Kerja sama langsung</p>
            <p className="font-medium mt-1">skylink@gmail.com</p>
          </div>

        </div>

      </div>

    </main>
  );
}