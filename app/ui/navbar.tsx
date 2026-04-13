'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const menu = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md">
      <div className="flex justify-between items-center px-10 py-4 text-white">

        <h1 className="font-bold text-xl">SKYBOLT</h1>

        <div className="flex gap-8">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className={`relative transition ${
                path === item.link
                  ? "text-white font-bold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}

              {/* garis bawah */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-orange-500 transition-all ${
                  path === item.link ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </div>

        <button className="bg-blue-600 px-4 py-2 rounded-lg">
          Log In
        </button>

      </div>
    </div>
  );
}