"use client";

import Navbar from "../ui/navbar";
import Image from "next/image";

export default function CompanyInfo() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-[#0f172a]">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[#0b1329]"></div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 1200px 600px at top, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.9) 60%, rgba(15,23,42,1) 100%)",
        }}
      ></div>

      <Navbar />

      <div className="relative z-10 flex flex-col items-center px-6 md:px-12 pt-32 pb-24 max-w-6xl mx-auto space-y-24">
        {/* ABOUT US SECTION */}
        <section id="about" className="grid md:grid-cols-12 gap-12 items-center w-full">
          <div className="md:col-span-5 relative w-full h-[350px] rounded-3xl overflow-hidden border border-white/10 shadow-xl group">
            <Image
              src="/about1.jpg"
              alt="About Sky Link"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
          </div>
          
          <div className="md:col-span-7 space-y-6 text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              About <span className="text-orange-400">Sky Link Air Cargo</span>
            </h2>
            <div className="w-16 h-1 bg-orange-400 rounded-full"></div>
            <p className="text-gray-300 leading-relaxed text-base font-light">
              Sky Link Air Cargo adalah penyedia jasa pengiriman kargo udara modern dan terpercaya. Kami berdedikasi untuk memberikan solusi logistik terbaik dengan menghubungkan berbagai destinasi melalui armada kargo udara yang cepat, aman, dan efisien. Didukung dengan teknologi realtime tracking, kami berkomitmen untuk transparansi dan ketepatan waktu dalam setiap pengiriman.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 hover:bg-white/10 transition duration-300">
                <h3 className="font-bold text-orange-400 text-lg flex items-center gap-2">
                  🎯 Visi Kami
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  Menjadi maskapai kargo udara pilihan utama yang mengintegrasikan rantai pasok global dengan layanan yang andal, berkelanjutan, dan didukung teknologi informasi terdepan.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 hover:bg-white/10 transition duration-300">
                <h3 className="font-bold text-orange-400 text-lg flex items-center gap-2">
                  🚀 Misi Kami
                </h3>
                <ul className="text-gray-300 text-sm space-y-1.5 list-disc list-inside font-light">
                  <li>Pengiriman aman, andal, dan tepat waktu.</li>
                  <li>Inovasi tracking realtime digital canggih.</li>
                  <li>Menjunjung tinggi standar keselamatan aviasi global.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="w-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Why <span className="text-orange-400">Choose Us</span>
            </h2>
            <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Keunggulan layanan logistik udara terpadu yang dirancang untuk mengutamakan keamanan dan kecepatan pengiriman Anda.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* CARD 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="/about2.jpg"
                  alt="Global Air Logistics"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">Express Delivery</h3>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed font-light">
                    Prioritas transit tercepat ke berbagai destinasi domestik maupun internasional dengan jadwal penerbangan terjadwal yang teratur.
                  </p>
                </div>
                <div className="text-orange-400 text-xs font-semibold pt-4 flex items-center gap-1.5 uppercase">
                  Fastest Option <span>➔</span>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="/about3.jpg"
                  alt="Special Cargo Handling"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">Specialized Cargo</h3>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed font-light">
                    Penanganan khusus bernilai tinggi untuk komoditas sensitif suhu, barang pecah belah, serta material berharga dengan protokol keamanan ekstra ketat.
                  </p>
                </div>
                <div className="text-orange-400 text-xs font-semibold pt-4 flex items-center gap-1.5 uppercase">
                  Premium Security <span>➔</span>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="/hero-desktop.png"
                  alt="Real-time AWB Tracking"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">Real-time Dashboard</h3>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed font-light">
                    Dukungan monitoring AWB yang transparan melalui dashboard modern yang langsung terupdate secara real-time dari gudang hingga tujuan akhir.
                  </p>
                </div>
                <div className="text-orange-400 text-xs font-semibold pt-4 flex items-center gap-1.5 uppercase">
                  Full Visibility <span>➔</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Our <span className="text-orange-400">Core Services</span>
            </h2>
            <div className="w-16 h-1 bg-orange-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Armada logistik udara kami siap melayani berbagai kebutuhan pengiriman kargo dalam skala besar dengan jaminan keamanan internasional.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 text-center space-y-4">
              <div className="text-4xl">✈️</div>
              <h3 className="font-bold text-lg text-white">Express Air Cargo</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Pengiriman kargo prioritas tinggi dengan waktu transit tercepat ke berbagai destinasi.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 text-center space-y-4">
              <div className="text-4xl">📦</div>
              <h3 className="font-bold text-lg text-white">General Cargo</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Pengiriman kargo umum bernilai ekonomis dengan kepastian jadwal keberangkatan.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 text-center space-y-4">
              <div className="text-4xl">🛡️</div>
              <h3 className="font-bold text-lg text-white">Special Cargo</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Penanganan khusus untuk barang berharga, komoditas sensitif suhu, dan pecah belah.
              </p>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}
