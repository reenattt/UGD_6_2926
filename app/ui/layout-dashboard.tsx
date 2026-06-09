"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getClientSession, clearClientSession, hasRoleAccess } from "../lib/auth";

function RealTimeClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB");
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="text-xs text-slate-500 font-mono mt-0.5">{time}</span>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSession = getClientSession();
    if (!currentSession) {
      router.push("/home?login=true");
      return;
    }
    if (!hasRoleAccess(currentSession.role, pathname)) {
      router.push("/dashboard");
      return;
    }
    setSession(currentSession);
    setLoading(false);
  }, [pathname, router]);

  const titles: any = {
    "/dashboard": "Dashboard",
    "/tracking": "Tracking AWB",
    "/manifest": "Shipments",
    "/dashboard/manage-admins": "Manage Admin Accounts",
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <div className={`${open ? "w-64" : "w-16"} bg-blue-800 text-white flex flex-col transition-all duration-300`}>

        <div className="flex items-center justify-between p-4">
          {open && (
            <div className="flex items-center gap-2">
              <img src="/bg_profil.png" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-bold">Sky Link</span>
            </div>
          )}

          <button onClick={() => setOpen(!open)} className="text-xl mx-auto">
            ☰
          </button>
        </div>

        {open && (
          <div className="px-4 mt-4 space-y-2">
            <div onClick={() => router.push("/dashboard")} className={`p-3 rounded cursor-pointer ${pathname === "/dashboard" ? "bg-blue-900" : "hover:bg-blue-700"}`}>
              Dashboard
            </div>

            <div onClick={() => router.push("/tracking")} className={`p-3 rounded cursor-pointer ${pathname === "/tracking" ? "bg-blue-900" : "hover:bg-blue-700"}`}>
              Tracking
            </div>

            <div onClick={() => router.push("/manifest")} className={`p-3 rounded cursor-pointer ${pathname === "/manifest" ? "bg-blue-900" : "hover:bg-blue-700"}`}>
              Shipments
            </div>

            {session?.role === "Owner" && (
              <div onClick={() => router.push("/dashboard/manage-admins")} className={`p-3 rounded cursor-pointer ${pathname === "/dashboard/manage-admins" ? "bg-blue-900" : "hover:bg-blue-700"}`}>
                Manage Admins
              </div>
            )}
          </div>
        )}

        {!open && (
          <div className="flex flex-col items-center mt-4 gap-4">
            <div onClick={() => router.push("/dashboard")} className="cursor-pointer" title="Dashboard">🏠</div>
            <div onClick={() => router.push("/tracking")} className="cursor-pointer" title="Tracking">📦</div>
            <div onClick={() => router.push("/manifest")} className="cursor-pointer" title="Shipments">📄</div>
            {session?.role === "Owner" && (
              <div onClick={() => router.push("/dashboard/manage-admins")} className="cursor-pointer" title="Manage Admins">👥</div>
            )}
          </div>
        )}

        {open && (
          <button
            onClick={() => {
              clearClientSession();
              router.push("/home");
            }}
            className="mt-auto m-4 bg-red-500 p-3 rounded"
          >
            Logout
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">

        <div className="flex justify-between items-center bg-white px-8 py-4 shadow-sm border-b border-slate-200">
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">{titles[pathname]}</h1>

          <div className="flex items-center gap-6">
            {/* Real-time Clock */}
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-sm font-semibold text-slate-800">
                {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <RealTimeClock />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
              <div className="text-xl">🔔</div>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 shadow-inner rounded-full flex items-center justify-center text-white font-bold tracking-wider">
                {session?.role ? session.role.charAt(0) : "O"}
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-800">{session?.role || "Operator"}</div>
                <div className="text-xs text-slate-500 font-medium">{session?.email || "operator@petir.com"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}