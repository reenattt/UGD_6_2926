"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#0b1f3a] to-[#020617] text-white p-6">
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-orange-500 tracking-widest">404</h1>
        
        <h2 className="text-2xl font-bold mt-4">Oops! Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400">Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.</p>
        
        <div className="pt-6">
          <Link href="/home" className="bg-orange-500 hover:bg-orange-600 transition px-8 py-3 rounded-full font-semibold text-lg inline-block hover:scale-105 shadow-lg shadow-orange-500/20">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
