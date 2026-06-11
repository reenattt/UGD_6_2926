"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getClientSession, clearClientSession, hasRoleAccess } from "../lib/auth";
import { Bell, LayoutDashboard, Package, BarChart3, MapPinned, Users, LogOut, CheckCircle, Truck, AlertCircle, X } from "lucide-react";
import { getProfile } from "../lib/profile";

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

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Shipments", path: "/manifest", icon: Package },
  { label: "Tracking", path: "/tracking", icon: MapPinned },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

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
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: "Arrived", title: "AWB015 Arrived", desc: "Cargo successfully arrived", time: "10 min ago", read: false },
    { id: 2, type: "In Transit", title: "AWB010 In Transit", desc: "Shipment moving to destination", time: "1 hour ago", read: false },
    { id: 3, type: "Manifested", title: "AWB125 Manifested", desc: "Shipment created successfully", time: "2 hours ago", read: true },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isNotifOpen]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      const currentSession = getClientSession();
      if (currentSession) {
        const p = getProfile(currentSession.username);
        if (p) {
          setProfileData(p);
        }
      }
    };
    window.addEventListener("skylink_profile_update", handleProfileUpdate);
    return () => window.removeEventListener("skylink_profile_update", handleProfileUpdate);
  }, []);

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
    const p = getProfile(currentSession.username);
    if (p) {
      setProfileData(p);
    }
    setLoading(false);
  }, [pathname, router]);

  const titles: any = {
    "/dashboard": "Dashboard",
    "/tracking": "Tracking AWB",
    "/manifest": "Shipments",
    "/reports": "Reports",
    "/dashboard/manage-admins": "Manage Admin Accounts",
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <div className={`${open ? "w-64" : "w-16"} bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-xl`}>

        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {open && (
            <div className="flex items-center gap-2">
              <img src="/bg_profil.png" className="w-10 h-10 rounded-full object-cover border-2 border-blue-400" />
              <span className="font-bold text-white">Sky Link</span>
            </div>
          )}

          <button onClick={() => setOpen(!open)} className="text-xl mx-auto text-slate-400 hover:text-white transition-colors">
            ☰
          </button>
        </div>

        <nav className="flex flex-col mt-6 px-4 gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                title={!open ? item.label : undefined}
                className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                } ${!open ? "justify-center" : ""}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} strokeWidth={2} />
                {open && <span>{item.label}</span>}
                {open && isActive && (
                  <span className="ml-auto w-1.5 h-5 bg-white/30 rounded-full" />
                )}
              </button>
            );
          })}

          {session?.role === "Owner" && (
            <button
              onClick={() => router.push("/dashboard/manage-admins")}
              title={!open ? "Manage Admins" : undefined}
              className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                pathname === "/dashboard/manage-admins"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${!open ? "justify-center" : ""}`}
            >
              <Users className={`w-5 h-5 flex-shrink-0 transition-colors ${pathname === "/dashboard/manage-admins" ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} strokeWidth={2} />
              {open && <span>Manage Admins</span>}
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button
            onClick={() => {
              clearClientSession();
              router.push("/home");
            }}
            className={`group w-full flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${
              !open ? "justify-center" : ""
            }`}
            title={!open ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={2} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        <div className="flex justify-between items-center bg-white px-8 py-4 shadow-sm border-b border-slate-200">
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">{titles[pathname] || "Sky Link"}</h1>

          <div className="flex items-center gap-6">
            {/* Real-time Clock */}
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-sm font-semibold text-slate-800">
                {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <RealTimeClock />
            </div>

            {/* Notification Button */}
            <div ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            {/* Profile Section */}
            <div 
              onClick={() => router.push("/profile")}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200"
            >
              {profileData?.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 shadow-inner rounded-full flex items-center justify-center text-white font-bold tracking-wider">
                  {profileData?.name ? profileData.name.charAt(0).toUpperCase() : (session?.role ? session.role.charAt(0) : "O")}
                </div>
              )}
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-800">{profileData?.name || session?.name || "Operator"}</div>
                <div className="text-xs text-slate-500 font-medium">{profileData?.email || session?.email || "operator@petir.com"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto min-w-0">
          {children}
        </div>
      </div>

      {/* NOTIFICATION MODAL */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsNotifOpen(false)}
          ></div>
          
          <div className="relative bg-white/95 backdrop-blur-md w-full max-w-[420px] max-h-[500px] flex flex-col rounded-[20px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-slate-500" /> Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-2">
              {notifications.map((n) => {
                let Icon = Package;
                let iconColor = "text-orange-500 bg-orange-50";
                
                if (n.type === "Arrived") {
                  Icon = CheckCircle;
                  iconColor = "text-emerald-500 bg-emerald-50";
                } else if (n.type === "In Transit") {
                  Icon = Truck;
                  iconColor = "text-blue-500 bg-blue-50";
                } else if (n.type === "Delayed") {
                  Icon = AlertCircle;
                  iconColor = "text-red-500 bg-red-50";
                }

                return (
                  <div key={n.id} className={`p-4 mx-2 my-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-4 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <div className={`p-2.5 rounded-full shrink-0 ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm truncate ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{n.title}</span>
                        {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1 shadow-sm shadow-blue-400/50"></span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.desc}</p>
                      <span className="block text-[11px] text-slate-400 font-medium mt-1.5">{n.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}