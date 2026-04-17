"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const path = usePathname();

  const menus = [
    { name: "Home", href: "/home" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 text-white">

      <div className="flex gap-12 text-xl font-semibold">
        {menus.map((item) => (
          <Link key={item.name} href={item.href}>
            <span className={`relative ${
              path === item.href
                ? "text-orange-400"
                : "hover:text-orange-300"
            }`}>
              {item.name}
              {path === item.href && (
                <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-orange-500"></span>
              )}
            </span>
          </Link>
        ))}
      </div>

      {/* LOGO */}
      <div className="absolute right-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white">
          <Image src="/bg_profil.png" alt="logo" fill className="object-cover" />
        </div>
        <span className="font-semibold">Sky Link</span>
      </div>

    </div>
  );
}