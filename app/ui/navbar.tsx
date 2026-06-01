"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import LoginForm from "./login-form";

export default function Navbar() {
  const path = usePathname();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setShowLogin(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

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
      <div 
        onClick={() => setShowLogin(true)}
        className="absolute right-10 flex items-center gap-3 cursor-pointer hover:opacity-85 transition"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white">
          <Image src="/bg_profil.png" alt="logo" fill className="object-cover" />
        </div>
        <span className="font-semibold">Sky Link</span>
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

    </div>
  );
}