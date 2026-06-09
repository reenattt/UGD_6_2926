"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageSearch, FileText } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tracking", href: "/tracking", icon: PackageSearch },
    { name: "Manifest", href: "/manifest", icon: FileText },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5 border-r border-slate-800">
      <h1 className="text-2xl font-bold mb-8 tracking-wide text-blue-400">Sky Link</h1>

      <div className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}