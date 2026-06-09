"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import LoginForm from "./login-form";

export default function Navbar() {
  const path = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setShowLogin(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
    
    // Real-time clock logic
    const updateClock = () => {
      const now = new Date();
      const dateOpts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
      const dateStr = now.toLocaleDateString("en-GB", dateOpts);
      const timeOpts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      const timeStr = now.toLocaleTimeString("en-GB", timeOpts);
      setTime(`${dateStr} | ${timeStr} WIB`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const menus = [
    { name: "Home", href: "/home" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 text-white backdrop-blur-sm bg-gradient-to-b from-black/40 to-transparent transition-all duration-300">

      <div className="flex gap-12 text-xl font-semibold">
        {menus.map((item) => (
          <Link key={item.name} href={item.href}>
            <span className={`relative group transition-colors duration-300 ${
              path === item.href
                ? "text-orange-400"
                : "text-gray-200 hover:text-orange-300"
            }`}>
              {item.name}
              <span className={`absolute left-0 -bottom-2 h-[3px] bg-orange-500 transition-all duration-300 ${
                path === item.href ? "w-full" : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
              }`}></span>
            </span>
          </Link>
        ))}
      </div>

      {/* LOGO AND CLOCK */}
      <div className="absolute right-10 flex items-center gap-6">
        
        {/* CLOCK */}
        {time && (
          <div className="hidden lg:flex items-center gap-2 text-sm font-mono text-gray-200 border-r border-white/20 pr-6">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="tracking-wide">{time}</span>
          </div>
        )}

        {/* LOGO */}
        <div 
          onClick={() => setShowLogin(true)}
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white/80 group-hover:border-orange-400 transition-colors duration-300 shadow-lg">
            <Image src="/bg_profil.png" alt="logo" fill className="object-cover" />
          </div>
          <span className="font-semibold text-white group-hover:text-orange-100 transition-colors">Sky Link</span>
        </div>
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

    </div>
  );
}