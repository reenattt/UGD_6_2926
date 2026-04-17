"use client";

import Navbar from "../ui/navbar";

export default function Contact() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#020617]"></div>
      {/* GLOW EFFECT KIRI */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[120px]"></div>
      {/* GLOW EFFECT KANAN */}
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[120px]"></div>
      {/* CONTENT */}
      <div className="relative z-10">


      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-10 pt-24">

        <h1 className="text-4xl font-semibold mb-10 animate-fadeInUp">
          Contact <span className="text-orange-400 font-bold">Sky Link</span>
        </h1>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">

          {/* CARD */}
          {[
            { icon: "📞", title: "Contact", value: "+62 123456789", delay: "delay-1" },
            { icon: "💬", title: "WhatsApp", value: "+62 123456789", delay: "delay-2" },
            { icon: "✉️", title: "Email", value: "skylink@gmail.com", delay: "delay-3" },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-blue-700/50 backdrop-blur-md p-6 rounded-xl text-center 
              animate-fadeInUp ${item.delay}
              transition duration-300 
              hover:scale-105 hover:bg-blue-600/70 hover:shadow-2xl 
              hover:shadow-[0_0_25px_rgba(255,165,0,0.4)] cursor-pointer`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h2 className="mb-2 font-medium">{item.title}</h2>
              <p>{item.value}</p>
            </div>
          ))}

        </div>

      </div>
      </div>

    </main>
  );
}