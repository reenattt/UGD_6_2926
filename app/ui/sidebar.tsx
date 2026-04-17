"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Tracking", href: "/tracking", icon: "📦" },
    { name: "Manifest", href: "/manifest", icon: "📝" },
  ];

  return (
    <div className="w-64 h-screen bg-blue-800 text-white p-5">

      <h1 className="text-xl font-bold mb-6">Sky Link</h1>

      <div className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-2 p-3 rounded ${
              pathname === item.href
                ? "bg-blue-950"
                : "hover:bg-blue-700"
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>

    </div>
  );
}