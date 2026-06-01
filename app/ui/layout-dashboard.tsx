"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getClientSession, clearClientSession, hasRoleAccess } from "../lib/auth";

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

        <div className="flex justify-between items-center bg-white px-6 py-3 shadow">
          <h1 className="font-semibold text-lg">{titles[pathname]}</h1>

          <div className="flex items-center gap-6">
            <div className="text-xl">🔔</div>

            <div className="flex items-center gap-2">
              <div>
                <div className="text-sm font-semibold">{session?.role || "Operator"}</div>
                <div className="text-xs text-gray-500">{session?.email || "operator@petir.com"}</div>
              </div>

              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white">
                👤
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