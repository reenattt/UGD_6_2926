"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle, Download, X } from "lucide-react";
import { Pagination } from "../ui/pagination";

function formatTs(ts: string | null | undefined) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WIB",
  };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Received: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
    Loaded: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
    Sortation: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20",
    Arrived: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    Delayed: "bg-red-50 text-red-700 ring-1 ring-red-600/20 animate-pulse",
  };
  const dotColors: Record<string, string> = {
    Arrived: "bg-emerald-500",
    Delayed: "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${colors[status] || "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[status] || "bg-current opacity-70"}`} />
      {status}
    </span>
  );
}

function AWBDetailModal({ shipment, onClose }: { shipment: any; onClose: () => void }) {
  const created = formatTs(shipment.created_at);
  const updated = formatTs(shipment.updated_at);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative my-auto animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">AWB Details</p>
            <h2 className="text-white text-xl font-extrabold font-mono tracking-tight">{shipment.awb}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</span>
            <StatusBadge status={shipment.shipping_status} />
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sender</p>
              <p className="font-semibold text-slate-800 text-sm">{shipment.sender_name}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receiver</p>
              <p className="font-semibold text-slate-800 text-sm">{shipment.receiver_name}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="font-semibold text-slate-800 text-sm">{shipment.phone || "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service</p>
              <p className="font-semibold text-slate-800 text-sm uppercase">{shipment.shipping_type}</p>
            </div>
          </div>

          {/* Route */}
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Flight Route</p>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="font-extrabold text-blue-600 text-lg">{shipment.origin_city}</p>
                <p className="text-xs text-slate-500">Origin</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full border-t-2 border-dashed border-slate-300 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-1 text-sm">✈</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-extrabold text-orange-600 text-lg">{shipment.destination_city}</p>
                <p className="text-xs text-slate-500">Destination</p>
              </div>
            </div>
          </div>

          {/* Item + Weight + Price */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Commodity</p>
              <p className="font-bold text-slate-800 text-sm">{shipment.item_type}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weight</p>
              <p className="font-bold text-slate-800 text-sm">{shipment.weight} kg</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
              <p className="font-bold text-emerald-700 text-sm">Rp {Number(shipment.price).toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3">
            {created && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                <p className="font-bold text-slate-800 text-sm">{created.date}</p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">{created.time}</p>
              </div>
            )}
            {updated && (
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="font-bold text-slate-800 text-sm">{updated.date}</p>
                <p className="text-[11px] font-mono text-orange-600 mt-0.5">{updated.time}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [awbPopup, setAwbPopup] = useState<any>(null);

  // ================= FETCH DATABASE =================
  const fetchShipments = () => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        setShipments(Array.isArray(data) ? data : []);
      });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // ================= STATISTICS =================
  const totalShipments = shipments.length;
  const deliveredCount = shipments.filter((item) => item.shipping_status === "Arrived").length;
  const delayedCount = shipments.filter((item) => item.shipping_status === "Delayed").length;
  const inProgressCount = shipments.filter((item) => item.shipping_status !== "Arrived").length;
  const totalRevenue = shipments.reduce((acc, item) => acc + Number(item.price || 0), 0);

  // ================= DAILY SHIPMENT DATA =================
  const dailyShipmentMap: Record<string, { date: string; total: number; timestamp: number }> = {};
  shipments.forEach((item) => {
    if (!item.shipping_date && !item.created_at) return;
    const dateStr = item.created_at || item.shipping_date;
    const date = new Date(dateStr);
    const isoDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
    if (!dailyShipmentMap[isoDate]) {
      dailyShipmentMap[isoDate] = {
        date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        total: 0,
        timestamp: new Date(isoDate).getTime(),
      };
    }
    dailyShipmentMap[isoDate].total += 1;
  });

  let dailyData = Object.values(dailyShipmentMap).sort((a, b) => a.timestamp - b.timestamp).slice(-7);
  if (dailyData.length === 0) dailyData.push({ date: "No Data", total: 0, timestamp: 0 });

  // ================= SEARCH =================
  const filteredShipments = useMemo(() => {
    if (!searchQuery.trim()) return shipments;
    const lowerQuery = searchQuery.toLowerCase();
    return shipments.filter(
      (item) =>
        item.awb?.toLowerCase().includes(lowerQuery) ||
        item.sender_name?.toLowerCase().includes(lowerQuery) ||
        item.receiver_name?.toLowerCase().includes(lowerQuery) ||
        item.item_type?.toLowerCase().includes(lowerQuery)
    );
  }, [shipments, searchQuery]);

  // ================= PAGINATION =================
  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentShipments = filteredShipments.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ================= EXPORT TO CSV =================
  const handleExportCSV = () => {
    if (shipments.length === 0) return;
    const headers = ["AWB,Sender,Receiver,Origin,Destination,Item,Weight,Price,Type,Status,Created,Updated"];
    const escapeCSV = (val: any) => `"${String(val || "").replace(/"/g, '""')}"`;
    const csvRows = shipments.map((item) => {
      const c = formatTs(item.created_at);
      const u = formatTs(item.updated_at);
      return `${escapeCSV(item.awb)},${escapeCSV(item.sender_name)},${escapeCSV(item.receiver_name)},${escapeCSV(item.origin_city)},${escapeCSV(item.destination_city)},${escapeCSV(item.item_type)},${escapeCSV(item.weight)},${escapeCSV(item.price)},${escapeCSV(item.shipping_type)},${escapeCSV(item.shipping_status)},${escapeCSV(c ? c.date + " " + c.time : "—")},${escapeCSV(u ? u.date + " " + u.time : "—")}`;
    });
    const csvContent = headers.concat(csvRows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `shipments_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1.5 font-medium">Cargo shipment monitoring & analytics</p>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-7 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Search className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Total Shipments</p>
          <h2 className="text-4xl font-black text-slate-900 relative z-10 tracking-tight">{totalShipments}</h2>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Delivered</p>
          <h2 className="text-4xl font-black text-emerald-600 relative z-10 tracking-tight">{deliveredCount}</h2>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Delayed</p>
          <h2 className="text-4xl font-black text-red-600 relative z-10 tracking-tight">{delayedCount}</h2>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">In Progress</p>
          <h2 className="text-4xl font-black text-blue-600 relative z-10 tracking-tight">{inProgressCount}</h2>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-7 rounded-2xl shadow-lg shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/40 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group text-white border border-slate-700">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Revenue</p>
          <h2 className="text-3xl font-black text-emerald-400 relative z-10 tracking-tight">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>

      {/* SHIPMENT ACTIVITY CHART */}
      <div className="bg-white p-8 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 mb-8 transition-all hover:shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Shipment Creation Activity By Date</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Daily shipment volume trends</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Shipments Charted</p>
            <p className="text-xl font-extrabold text-emerald-600">
              {dailyData.reduce((acc, curr) => acc + curr.total, 0)} <span className="text-sm text-slate-500 font-medium">shipments</span>
            </p>
          </div>
        </div>

        <div className="flex h-64 md:h-[320px] relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            {[4, 3, 2, 1, 0].map((i) => {
              const maxVal = Math.max(...dailyData.map((d) => d.total), 4);
              const val = Math.ceil((maxVal * i) / 4);
              return (
                <div key={i} className="flex items-center w-full border-t border-slate-100 border-dashed relative">
                  <span className="absolute -top-3 -left-2 bg-white px-1 text-[10px] font-semibold text-slate-400">{val}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-end justify-between w-full h-full pb-8 pt-6 pl-12 gap-2 sm:gap-6 z-10 relative">
            {dailyData.map((item, index) => {
              const maxTotal = Math.max(...dailyData.map((d) => d.total), 1);
              const heightPercent = (item.total / maxTotal) * 100;
              const isPeak = item.total === Math.max(...dailyData.map((d) => d.total)) && item.total > 0;
              
              const CHART_PALETTE = [
                { base: "bg-blue-50", border: "border-blue-200/50", hover: "hover:bg-blue-100", peak: "from-blue-600 to-blue-400", norm: "from-blue-400 to-blue-300" },
                { base: "bg-emerald-50", border: "border-emerald-200/50", hover: "hover:bg-emerald-100", peak: "from-emerald-600 to-emerald-400", norm: "from-emerald-400 to-emerald-300" },
                { base: "bg-indigo-50", border: "border-indigo-200/50", hover: "hover:bg-indigo-100", peak: "from-indigo-600 to-indigo-400", norm: "from-indigo-400 to-indigo-300" },
                { base: "bg-orange-50", border: "border-orange-200/50", hover: "hover:bg-orange-100", peak: "from-orange-500 to-orange-400", norm: "from-orange-400 to-orange-300" },
                { base: "bg-rose-50", border: "border-rose-200/50", hover: "hover:bg-rose-100", peak: "from-rose-600 to-rose-400", norm: "from-rose-400 to-rose-300" },
                { base: "bg-cyan-50", border: "border-cyan-200/50", hover: "hover:bg-cyan-100", peak: "from-cyan-600 to-cyan-400", norm: "from-cyan-400 to-cyan-300" },
                { base: "bg-amber-50", border: "border-amber-200/50", hover: "hover:bg-amber-100", peak: "from-amber-500 to-amber-400", norm: "from-amber-400 to-amber-300" },
              ];
              const color = CHART_PALETTE[index % CHART_PALETTE.length];

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl pointer-events-none transform -translate-y-2 group-hover:-translate-y-4 whitespace-nowrap z-50">
                    {item.date} &rarr; {item.total} shipments
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                  </div>
                  <div className={`w-full relative ${color.base} rounded-t-xl overflow-hidden h-full flex flex-col justify-end border ${color.border} border-b-0 ${color.hover} transition-colors`}>
                    <div
                      className={`w-full transition-all duration-700 ease-out relative bg-gradient-to-t ${isPeak ? color.peak : color.norm}`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] sm:text-xs font-bold text-slate-600 text-center truncate w-full px-1" title={item.date}>
                    {item.date.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RECENT SHIPMENTS */}
      <div className="bg-white p-8 rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 mb-8 transition-all hover:shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Recent Shipments</h2>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search AWB, Sender, Receiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full md:w-80 lg:w-96 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap"
            >
              <Download size={16} className="text-slate-500" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">AWB</th>
                <th className="px-5 py-4 whitespace-nowrap">Sender</th>
                <th className="px-5 py-4 whitespace-nowrap">Receiver</th>
                <th className="px-5 py-4 whitespace-nowrap">Destination</th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap">Price</th>
                <th className="px-5 py-4 whitespace-nowrap">Created / Updated</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-600">No shipments found matching your search</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentShipments.map((item, index) => {
                  const created = formatTs(item.created_at || item.shipping_date);
                  const updated = formatTs(item.updated_at);
                  const showUpdated = updated && item.updated_at && item.updated_at !== item.created_at;
                  return (
                    <tr key={index} className="hover:bg-blue-50/40 transition-colors bg-white group">
                      {/* CLICKABLE AWB */}
                      <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">
                        <button
                          onClick={() => setAwbPopup(item)}
                          className="font-mono font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors text-left"
                          title="View shipment details"
                        >
                          {item.awb}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.sender_name}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.receiver_name}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.destination_city}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.shipping_status} />
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </td>
                      {/* TIMESTAMP COLUMN */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          {created && (
                            <>
                              <span className="text-slate-800 font-medium text-sm">{created.date}</span>
                              <span className="text-slate-400 text-[11px] font-mono">{created.time}</span>
                            </>
                          )}
                          {showUpdated && (
                            <span className="text-orange-600 text-[10px] font-bold mt-1">
                              ↻ {updated?.date} {updated?.time}
                            </span>
                          )}
                        </div>
                      </td>
                      {/* ACTION BUTTONS */}
                      <td className="px-5 py-4 text-center min-w-[130px]">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setAwbPopup(item)}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-semibold transition-all duration-200 cursor-pointer bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
                            title="View Shipment Details"
                          >
                            <Search className="w-3.5 h-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-slate-200 gap-4">
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
              Total Shipments: <span className="font-bold text-slate-700">{filteredShipments.length}</span>
            </span>
            <div className="flex justify-end w-full sm:w-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* AWB DETAIL POPUP */}
      {awbPopup && <AWBDetailModal shipment={awbPopup} onClose={() => setAwbPopup(null)} />}
    </DashboardLayout>
  );
}
