import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-blue-900 text-white p-4 flex justify-between">
        <h1 className="font-bold">Go Fly</h1>
        <div className="space-x-4">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Tracking</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 items-center p-10 gap-10">

        {/* TEXT */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Air Cargo Solutions
          </h2>

          <p className="text-gray-600 mb-6">
            Go Fly menyediakan layanan kargo udara cepat, aman, dan
            real-time tracking untuk mendukung operasional logistik modern.
          </p>

          <div className="flex gap-4">
            <Link
              href="#"
              className="bg-blue-900 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>

            <Link
              href="#"
              className="border border-gray-300 px-6 py-3 rounded-lg"
            >
              Track Shipment
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <Image
            src="/wp1.jpeg"
            alt="cargo"
            width={600}
            height={400}
            className="rounded-lg"
          />
        </div>

      </section>

      {/* ABOUT */}
      <section className="p-10 bg-white text-center">
        <h3 className="text-2xl font-semibold mb-4">Tentang Go Fly</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Go Fly adalah sistem kargo udara yang dirancang untuk memberikan
          kecepatan, akurasi, dan kemudahan bagi operator dalam memantau
          pengiriman barang secara real-time.
        </p>
      </section>

    </main>
  );
}