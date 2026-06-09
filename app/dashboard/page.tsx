"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Search, AlertCircle, Download } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<number | null>(null);

  // ================= FETCH DATABASE =================
  const fetchShipments = () => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        setShipments(data);
      });
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // ================= STATISTICS =================
  const totalShipments = shipments.length;

  const deliveredCount = shipments.filter(
    (item) => item.shipping_status === "Arrived"
  ).length;

  const delayedCount = shipments.filter(
    (item) => item.shipping_status === "Delayed"
  ).length;

  const inProgressCount = shipments.filter(
    (item) => item.shipping_status !== "Arrived"
  ).length;

  const totalRevenue = shipments.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0
  );

  // ================= DAILY SHIPMENT DATA =================
  const dailyShipmentMap: Record<string, { date: string; total: number; timestamp: number }> = {};

  shipments.forEach((item) => {
    if (!item.shipping_date && !item.created_at) return;
    const dateStr = item.created_at || item.shipping_date;
    const date = new Date(dateStr);
    
    // Group by YYYY-MM-DD
    const isoDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
    
    if (!dailyShipmentMap[isoDate]) {
      dailyShipmentMap[isoDate] = {
        date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        total: 0,
        timestamp: new Date(isoDate).getTime()
      };
    }
    dailyShipmentMap[isoDate].total += 1;
  });

  // Convert map to sorted array (chronological) and take the last 7 days of activity
  let dailyData = Object.values(dailyShipmentMap)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7);

  if (dailyData.length === 0) {
    dailyData.push({ date: "No Data", total: 0, timestamp: 0 });
  }

  // ================= SEARCH =================
  const filteredShipments = useMemo(() => {
    if (!searchQuery.trim()) return shipments;
    const lowerQuery = searchQuery.toLowerCase();
    return shipments.filter((item) => 
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

  // ================= DELETE LOGIC =================
  const confirmDelete = (id: number) => {
    setShipmentToDelete(id);
    setShowDeleteModal(true);
  };

  // ================= EXPORT TO CSV =================
  const handleExportCSV = () => {
    if (shipments.length === 0) return;
    const headers = ["AWB,Sender,Receiver,Origin,Destination,Item,Weight,Price,Type,Status,Date"];
    const csvRows = shipments.map(item => {
      return `${item.awb},${item.sender_name},${item.receiver_name},${item.origin_city},${item.destination_city},${item.item_type},${item.weight},${item.price},${item.shipping_type},${item.shipping_status},${new Date(item.shipping_date).toLocaleDateString("id-ID")}`;
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

  const handleDelete = async () => {
    if (!shipmentToDelete) return;
    try {
      const response = await fetch("/api/delete-shipment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shipmentToDelete }),
      });
      const data = await response.json();
      if (data.success) {
        fetchShipments();
      } else {
        alert(data.error || "Failed to delete shipment");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the shipment");
    } finally {
      setShowDeleteModal(false);
      setShipmentToDelete(null);
    }
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
        {/* TOTAL SHIPMENT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Search className="w-16 h-16 text-blue-600" />
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Total Shipments</p>
          <h2 className="text-4xl font-extrabold text-slate-900 relative z-10">{totalShipments}</h2>
        </div>
        {/* DELIVERED */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Delivered</p>
          <h2 className="text-4xl font-extrabold text-emerald-600 relative z-10">{deliveredCount}</h2>
        </div>
        {/* DELAYED */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Delayed</p>
          <h2 className="text-4xl font-extrabold text-red-600 relative z-10">{delayedCount}</h2>
        </div>
        {/* IN PROGRESS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">In Progress</p>
          <h2 className="text-4xl font-extrabold text-blue-600 relative z-10">{inProgressCount}</h2>
        </div>
        {/* REVENUE */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-white border border-slate-700">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">Revenue</p>
          <h2 className="text-3xl font-extrabold text-emerald-400 relative z-10 tracking-tight">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>

      {/* SHIPMENT ACTIVITY CHART */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
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
        
        {/* Y-Axis Label Area */}
        <div className="flex h-64 md:h-[320px] relative">
          
          {/* Y-Axis scale lines (background) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            {[4, 3, 2, 1, 0].map((i) => {
              const maxVal = Math.max(...dailyData.map(d => d.total), 4);
              // Ensure integer scaling
              const val = Math.ceil((maxVal * i) / 4);
              return (
                <div key={i} className="flex items-center w-full border-t border-slate-100 border-dashed relative">
                  <span className="absolute -top-3 -left-2 bg-white px-1 text-[10px] font-semibold text-slate-400">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between w-full h-full pb-8 pt-6 pl-12 gap-2 sm:gap-6 z-10 relative">
            {dailyData.map((item, index) => {
              const maxTotal = Math.max(...dailyData.map(d => d.total), 1);
              const heightPercent = (item.total / maxTotal) * 100;
              
              // Find if this is the peak day
              const isPeak = item.total === Math.max(...dailyData.map(d => d.total)) && item.total > 0;

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                  {/* Tooltip */}
                  <div className="absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl pointer-events-none transform -translate-y-2 group-hover:-translate-y-4 whitespace-nowrap z-50">
                    {item.date} &rarr; {item.total} shipments
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                  </div>
                  
                  {/* Bar */}
                  <div className="w-full relative bg-emerald-50 rounded-t-xl overflow-hidden h-full flex flex-col justify-end border border-emerald-200/50 border-b-0 hover:bg-emerald-100 transition-colors">
                    <div
                      className={`w-full transition-all duration-700 ease-out relative ${
                        isPeak 
                          ? "bg-gradient-to-t from-emerald-600 to-emerald-400" 
                          : "bg-gradient-to-t from-emerald-400 to-emerald-300"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  
                  {/* X-Axis Label */}
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
        {/* TABLE HEADER */}
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
                className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full md:w-80 lg:w-96 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm bg-slate-50 hover:bg-white focus:bg-white"
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

        {/* TABLE WRAPPER */}
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
                <th className="px-5 py-4 whitespace-nowrap">Date</th>
                <th className="px-5 py-4 text-center whitespace-nowrap">Actions</th>
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
                currentShipments.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors bg-white group">
                    <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">{item.awb}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.sender_name}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.receiver_name}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{item.destination_city}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap
                        ${item.shipping_status === "Received" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20" :
                          item.shipping_status === "Loaded" ? "bg-green-50 text-green-700 ring-1 ring-green-600/20" :
                          item.shipping_status === "Sortation" ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20" :
                          item.shipping_status === "Arrived" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" :
                          item.shipping_status === "Delayed" ? "bg-red-50 text-red-700 ring-1 ring-red-600/20 animate-pulse" :
                          "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          item.shipping_status === "Arrived" ? "bg-emerald-500" :
                          item.shipping_status === "Delayed" ? "bg-red-500" :
                          "bg-current opacity-70"
                        }`}></span>
                        {item.shipping_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-medium">
                      {new Date(item.shipping_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/edit-shipment/${item.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-blue-100"
                          title="Edit Shipment"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-red-100"
                          title="Delete Shipment"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition shadow-sm font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md mx-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Delete Shipment</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this shipment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setShipmentToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
