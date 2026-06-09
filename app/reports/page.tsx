"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState, useEffect, useMemo } from "react";
import { Search, Printer, ChevronUp, ChevronDown } from "lucide-react";

import { SHIPMENT_STATUSES } from "../lib/definitions";
import { StatusBadge } from "../ui/status-badge";
function formatTimestamp(ts: string | null | undefined) {
  if (!ts) return { date: "—", time: "" };
  const d = new Date(ts);
  if (isNaN(d.getTime())) return { date: "—", time: "" };
  return {
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") + " WIB",
  };
}

type SortKey = "awb" | "sender_name" | "destination_city" | "weight" | "price" | "created_at" | "updated_at";
type SortDir = "asc" | "desc";

export default function ReportsPage() {
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        // Fetch all shipments, no longer filtering by completed only
        setAllShipments(data);
      });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let items = [...allShipments];
    if (statusFilter !== "all") {
      items = items.filter((s) => s.shipping_status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (s) =>
          s.awb?.toLowerCase().includes(q) ||
          s.sender_name?.toLowerCase().includes(q) ||
          s.receiver_name?.toLowerCase().includes(q) ||
          s.destination_city?.toLowerCase().includes(q) ||
          s.item_type?.toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => {
      let aVal = a[sortKey] ?? "";
      let bVal = b[sortKey] ?? "";
      if (sortKey === "created_at" || sortKey === "updated_at") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return items;
  }, [allShipments, searchQuery, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrint = () => {
    window.print();
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="ml-1 text-slate-300">↕</span>;
    return sortDir === "asc" ? (
      <ChevronUp className="inline w-3 h-3 ml-1 text-blue-600" />
    ) : (
      <ChevronDown className="inline w-3 h-3 ml-1 text-blue-600" />
    );
  };

  return (
    <DashboardLayout>
      {/* ======================== PRINT STYLES ======================== */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; top: 0; left: 0; width: 100%; }
          #no-print { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>

      {/* PRINT HEADER — hidden on screen */}
      <div id="print-area">
        <div className="hidden print:block mb-6 text-center border-b-2 border-slate-800 pb-4">
          <h1 className="text-2xl font-bold">Sky Link Cargo — Shipments Report</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generated: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })} {new Date().toLocaleTimeString("id-ID")} WIB
          </p>
          <p className="text-sm text-slate-500">Total Records: {filtered.length}</p>
        </div>

        {/* PAGE HEADER */}
        <div id="no-print" className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipment Reports</h1>
            <p className="text-slate-500 text-sm mt-1">
              <span className="font-bold text-slate-700">{filtered.length}</span> Shipments 
              <span className="mx-2">•</span> 
              <span className="font-bold text-emerald-600">{filtered.filter((s) => s.shipping_status === "Arrived").length}</span> Arrived 
              <span className="mx-2">•</span> 
              <span className="font-bold text-sky-600">{filtered.filter((s) => s.shipping_status === "Departed").length}</span> Departed 
              <span className="mx-2">•</span> 
              <span className="font-bold text-purple-600">{filtered.filter((s) => s.shipping_status === "Sortation").length}</span> Sortation
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer size={16} />
            Print Report
          </button>
        </div>

        {/* FILTERS */}
        <div id="no-print" className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100 p-5 mb-6 transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search AWB, sender, receiver, destination..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-sm hover:border-slate-300"
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white text-slate-900 font-medium min-w-[180px] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    { label: "AWB", key: "awb" as SortKey },
                    { label: "Sender", key: "sender_name" as SortKey },
                    { label: "Receiver", key: null },
                    { label: "Route", key: "destination_city" as SortKey },
                    { label: "Commodity", key: null },
                    { label: "Weight", key: "weight" as SortKey },
                    { label: "Price", key: "price" as SortKey },
                    { label: "Status", key: null },
                    { label: "Created", key: "created_at" as SortKey },
                    { label: "Updated", key: "updated_at" as SortKey },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      onClick={() => key && handleSort(key)}
                      className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap ${key ? "cursor-pointer hover:text-slate-800 select-none" : ""}`}
                    >
                      {label}
                      {key && <SortIcon col={key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-300" />
                        <p className="font-medium">No shipments found</p>
                        <p className="text-xs text-slate-400">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((item, i) => {
                    const created = formatTimestamp(item.created_at);
                    const updated = formatTimestamp(item.updated_at);
                    return (
                      <tr key={i} className="hover:bg-blue-50/40 transition-colors duration-200 group">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap font-mono">{item.awb}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.sender_name}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.receiver_name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <span className="text-slate-500 text-xs">{item.origin_city}</span>
                            <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            <span className="text-xs">{item.destination_city}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.item_type}</td>
                        <td className="px-4 py-3 text-slate-700 font-semibold whitespace-nowrap">{item.weight} kg</td>
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">Rp {Number(item.price).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <StatusBadge status={item.shipping_status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-medium text-xs">{created.date}</span>
                            <span className="text-slate-500 text-[10px] font-mono">{created.time}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-medium text-xs">{updated.date}</span>
                            <span className="text-orange-600 text-[10px] font-mono">{updated.time}</span>
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
            <div id="no-print" className="flex justify-between items-center px-6 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 font-medium">
                Page {currentPage} of {totalPages} · {filtered.length} records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-blue-600 border border-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRINT SUMMARY */}
        <div className="hidden print:block mt-8 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
          Sky Link Cargo Information System · Confidential · Generated by automated system
        </div>
      </div>
    </DashboardLayout>
  );
}
