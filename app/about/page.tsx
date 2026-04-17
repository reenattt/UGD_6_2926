"use client";

import Navbar from "../ui/navbar";
import Image from "next/image";

export default function About() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">

      <Navbar />

      <div className="flex items-center justify-center min-h-screen text-center px-6 pt-24">

        <div className="space-y-6 max-w-2xl">

          <h1 className="text-5xl font-bold animate-fadeInUp">
            About Sky Link
          </h1>

          <p className="text-gray-300 animate-fadeInUp delay-1">
            Sky Link adalah platform modern untuk pengelolaan kargo udara
            yang memungkinkan tracking real-time, efisiensi operasional,
            dan transparansi pengiriman.
          </p>

          <div className="animate-fadeInUp delay-2">
            <Image
              src="/bg_profil.png"
              alt="profil"
              width={160}
              height={160}
              className="mx-auto rounded-full object-cover"
            />
          </div>

        </div>

      </div>

    </main>
  );
}