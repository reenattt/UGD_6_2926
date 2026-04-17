"use client";

import Navbar from "../ui/navbar";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#1e3a8a] text-white">

      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-10 pt-24">

        <h1 className="text-4xl font-semibold mb-10 animate-fadeInUp">
          Contact <span className="text-orange-400">Sky Link</span>
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

    </main>
  );
}