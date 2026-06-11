"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState, useEffect, useMemo } from "react";
import { Search, Printer, ChevronUp, ChevronDown } from "lucide-react";

import { SHIPMENT_STATUSES } from "../lib/definitions";
import { StatusBadge } from "../ui/status-badge";
import { Pagination } from "../ui/pagination";
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

  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isPrintingIndividual, setIsPrintingIndividual] = useState(false);

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        setAllShipments(Array.isArray(data) ? data : []);
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

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentMonthFiltered = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return filtered.filter(item => {
      if (!item.created_at) return false;
      const d = new Date(item.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [filtered]);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintIndividual = () => {
    setIsPrintingIndividual(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrintingIndividual(false), 500);
    }, 100);
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
          ${isPrintingIndividual 
            ? `#print-individual-area, #print-individual-area * { visibility: visible; }
               #print-individual-area { position: absolute; top: 0; left: 0; width: 100%; }`
            : `#print-area, #print-area * { visibility: visible; }
               #print-area { position: absolute; top: 0; left: 0; width: 100%; }`
          }
          #no-print { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:hidden { display: none !important; }
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search AWB, route, status..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md hover:border-slate-300"
              />
            </div>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-14 bg-white border border-slate-200 rounded-2xl px-4 text-slate-800 font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md hover:border-slate-300 min-w-[180px] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="print:hidden bg-white rounded-2xl shadow-md shadow-slate-200/40 border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
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
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedShipment(item)}
                            className="font-bold font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors text-left"
                          >
                            {item.awb}
                          </button>
                        </td>
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
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">Rp {(Number(item.price) || 0).toLocaleString("id-ID")}</td>
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
            <div id="no-print" className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-slate-100 gap-4">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                Total Reports: <span className="font-bold text-slate-700">{filtered.length}</span>
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

        {/* PRINT TABLE (All Current Month Records) */}
        <div className="hidden print:block mt-6">
          <table className="w-full text-xs text-left border-collapse border border-slate-800">
            <thead className="bg-slate-100 border-b-2 border-slate-800">
              <tr>
                <th className="border border-slate-800 px-2 py-1">AWB</th>
                <th className="border border-slate-800 px-2 py-1">Sender</th>
                <th className="border border-slate-800 px-2 py-1">Receiver</th>
                <th className="border border-slate-800 px-2 py-1">Origin</th>
                <th className="border border-slate-800 px-2 py-1">Dest</th>
                <th className="border border-slate-800 px-2 py-1">Weight</th>
                <th className="border border-slate-800 px-2 py-1">Aircraft</th>
                <th className="border border-slate-800 px-2 py-1">Type</th>
                <th className="border border-slate-800 px-2 py-1">Status</th>
                <th className="border border-slate-800 px-2 py-1">Date</th>
                <th className="border border-slate-800 px-2 py-1">Price</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthFiltered.map((item, i) => (
                <tr key={i}>
                  <td className="border border-slate-800 px-2 py-1 font-mono font-bold">{item.awb}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.sender_name}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.receiver_name}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.origin_city}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.destination_city}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.weight} kg</td>
                  <td className="border border-slate-800 px-2 py-1">{item.vehicle_id ? `SL-${String(item.vehicle_id).padStart(3, '0')}` : "—"}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.shipping_type}</td>
                  <td className="border border-slate-800 px-2 py-1">{item.shipping_status}</td>
                  <td className="border border-slate-800 px-2 py-1">{formatTimestamp(item.created_at).date}</td>
                  <td className="border border-slate-800 px-2 py-1">Rp {(Number(item.price) || 0).toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {currentMonthFiltered.length === 0 && (
                <tr>
                  <td colSpan={11} className="border border-slate-800 px-2 py-4 text-center">No matching records found for the current month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PRINT SUMMARY */}
        <div className="hidden print:block mt-8 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
          Sky Link Cargo Information System · Confidential · Generated by automated system
        </div>
      </div>

      {/* SHIPMENT DETAIL MODAL */}
      {selectedShipment && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div id="print-individual-area" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:w-full print:max-w-none">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:bg-transparent print:border-slate-800 print:border-b-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight print:text-2xl">Shipment Detail</h2>
                <p className="text-slate-500 text-sm font-mono mt-1 print:hidden">{selectedShipment.awb}</p>
              </div>
              <div id="no-print" className="flex gap-3">
                {selectedShipment.shipping_status === "Received" && (
                  <button 
                    onClick={handlePrintIndividual}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all text-sm"
                  >
                    <Printer size={14} /> Print Shipment
                  </button>
                )}
                <button 
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Layout for print vs screen */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">AWB Number</span>
                  <span className="font-bold text-slate-900 font-mono text-base">{selectedShipment.awb}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Current Status</span>
                  <div className="print:hidden">
                    <StatusBadge status={selectedShipment.shipping_status} />
                  </div>
                  <div className="hidden print:block font-bold text-slate-900">{selectedShipment.shipping_status}</div>
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-4 print:border-slate-300"></div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Sender</span>
                  <span className="font-semibold text-slate-800">{selectedShipment.sender_name}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Receiver</span>
                  <span className="font-semibold text-slate-800">{selectedShipment.receiver_name}</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Origin Airport</span>
                  <span className="font-medium text-slate-700">{selectedShipment.origin_city}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Destination Airport</span>
                  <span className="font-medium text-slate-700">{selectedShipment.destination_city}</span>
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-4 print:border-slate-300"></div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Weight & Type</span>
                  <span className="font-medium text-slate-700">{selectedShipment.weight} kg — {selectedShipment.item_type}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Aircraft</span>
                  <span className="font-medium text-slate-700">{selectedShipment.vehicle_id ? `SL-${String(selectedShipment.vehicle_id).padStart(3, '0')}` : "Not Assigned"}</span>
                </div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Shipping Type</span>
                  <span className="font-medium text-slate-700">{selectedShipment.shipping_type}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Shipping Price</span>
                  <span className="font-bold text-slate-900">Rp {(Number(selectedShipment.price) || 0).toLocaleString("id-ID")}</span>
                </div>

                <div className="col-span-2 border-t border-slate-100 pt-4 print:border-slate-300"></div>

                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Created Date</span>
                  <span className="font-medium text-slate-700">
                    {formatTimestamp(selectedShipment.created_at).date} {formatTimestamp(selectedShipment.created_at).time}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-xs mb-1">Updated Date</span>
                  <span className="font-medium text-slate-700">
                    {formatTimestamp(selectedShipment.updated_at).date} {formatTimestamp(selectedShipment.updated_at).time}
                  </span>
                </div>

              </div>
              <div className="hidden print:block mt-8 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
                Sky Link Cargo Information System · Generated by automated system
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
