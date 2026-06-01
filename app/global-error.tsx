"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#0f172a] via-[#0b1f3a] to-[#020617] text-white overflow-hidden">
        <main className="min-h-screen w-full flex flex-col items-center justify-center relative p-6">
          <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]"></div>

          <div className="relative z-10 text-center space-y-6 max-w-md bg-[#1b1b1b]/80 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="text-5xl">🚨</div>
            <h2 className="text-2xl font-bold mt-4">Kesalahan Sistem Kritis!</h2>
            <p className="text-gray-400">Sistem mendeteksi adanya kegagalan fatal pada root layout.</p>
            
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={() => reset()}
                className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-full font-semibold text-sm hover:scale-105"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
