"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState } from "react";
import { ITEM_CATEGORIES, SHIPMENT_STATUSES } from "../lib/definitions";
import { AIRPORT_MASTER_DATA, resolveAirport } from "../lib/airports";
import { SearchableSelect } from "../ui/searchable-select";
import { StatusBadge } from "../ui/status-badge";
import { X } from "lucide-react";

function formatTs(ts: string | null | undefined) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":") + " WIB",
  };
}

function AWBDetailModal({ shipment, onClose }: { shipment: any; onClose: () => void }) {
  const created = formatTs(shipment.created_at);
  const updated = formatTs(shipment.updated_at);
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative my-auto border border-slate-100 transform scale-100 transition-all">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">AWB Details</p>
            <h2 className="text-white text-xl font-extrabold font-mono">{shipment.awb}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          
          {/* CUSTOMER INFORMATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sender Name</p>
                <p className="font-semibold text-slate-800 text-sm">{shipment.sender_name}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receiver Name</p>
                <p className="font-semibold text-slate-800 text-sm">{shipment.receiver_name}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="font-semibold text-slate-800 text-sm">{shipment.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* SHIPMENT INFORMATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shipment Information</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Commodity</p>
                <p className="font-bold text-slate-800 text-sm">{shipment.commodity}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weight</p>
                <p className="font-bold text-slate-800 text-sm">{shipment.weight} kg</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p>
                <p className="font-bold text-slate-800 text-sm">Rp {Number(shipment.price).toLocaleString("id-ID")}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shipment Type</p>
                <p className="font-bold text-slate-800 text-sm uppercase">{shipment.shipping_type}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Aircraft Allocation</p>
                <p className="font-bold text-slate-800 text-[11px] truncate" title={shipment.vehicle_name}>{shipment.vehicle_name}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-start">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</p>
                <StatusBadge status={shipment.status} />
              </div>
            </div>
          </div>

          {/* ROUTE INFORMATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Route Information</h3>
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="text-center w-1/3">
                  <p className="font-extrabold text-blue-600 text-lg truncate" title={shipment.origin}>{shipment.origin}</p>
                  <p className="text-xs text-slate-500">Origin Airport</p>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-1 text-sm rounded-full">✈</span>
                </div>
                <div className="text-center w-1/3">
                  <p className="font-extrabold text-orange-600 text-lg truncate" title={shipment.destination}>{shipment.destination}</p>
                  <p className="text-xs text-slate-500">Destination Airport</p>
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE INFORMATION */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Timeline Information</h3>
            <div className="grid grid-cols-2 gap-3">
              {created && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                  <p className="font-bold text-slate-800 text-sm">{created.date}</p>
                  <p className="text-[11px] font-mono text-slate-500">{created.time}</p>
                </div>
              )}
              {updated && (
                <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="font-bold text-slate-800 text-sm">{updated.date}</p>
                  <p className="text-[11px] font-mono text-orange-600">{updated.time}</p>
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="px-6 pb-6 mt-2">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}function formatShipment(item: any) {
  return {
    id: item.id,
    awb: item.awb,
    sender_name: item.sender_name,
    receiver_name: item.receiver_name,
    phone: item.phone,
    origin: item.origin_city || item.origin,
    destination: item.destination_city || item.destination,
    commodity: item.item_type || item.commodity,
    weight: item.weight,
    price: item.price,
    shipping_type: item.shipping_type,
    status: item.shipping_status || item.status,
    notes: item.notes,
    vehicle_id: item.vehicle_id,
    vehicle_name: item.vehicle_id == 1 ? "Boeing 737 Cargo" : "Airbus A330 Cargo",
    created_at: item.created_at || item.shipping_date,
    updated_at: item.updated_at || item.created_at || item.shipping_date,
  };
}

export default function Manifest() {

  const [showForm, setShowForm] = useState(false);
  const [awbPopup, setAwbPopup] = useState<any>(null);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [shipments, setShipments] =
    useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [generalError, setGeneralError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= FORM =================

  const [form, setForm] = useState({

    sender_name: "",

    receiver_name: "",

    phone: "",

    origin: "",
    destination: "",

    commodity: "",

    weight: "",

    shipping_type: "Biasa",

    shipping_status: "Sortation",

    notes: "",

    vehicle_id: "1",

  });

  // ================= FETCH =================

  useEffect(() => {

    fetch("/api/shipments")

      .then((res) => res.json())

      .then((data) => {
        const formatted = Array.isArray(data) ? data.map(formatShipment) : [];
        setShipments(formatted);
      });

  }, []);

  // ================= AUTO AWB =================

  const generateAWB = () => {

    if (shipments.length === 0) {

      return "AWB001";

    }

    const numbers = shipments.map((item) =>

      Number(
        item.awb.replace("AWB", "")
      )

    );

    const maxNumber = Math.max(...numbers);

    const nextNumber = maxNumber + 1;

    return `AWB${String(nextNumber).padStart(3, "0")}`;

  };

  // ================= PRICE =================

  const basePrice =
    Number(form.weight || 0) * 50000;

  const extraPrice =
    form.shipping_type === "Express"
      ? 250000
      : form.shipping_type === "VVIP"
        ? 500000
        : 0;

  const totalPrice =
    basePrice + extraPrice;

  // ================= CREATE =================

  const handleSubmit = async () => {

    const newErrors: Record<string, string> = {};
    if (!form.sender_name?.trim()) newErrors.sender_name = "Sender Name is required";
    if (!form.receiver_name?.trim()) newErrors.receiver_name = "Receiver Name is required";
    if (!form.phone?.trim()) newErrors.phone = "Phone Number is required";
    if (!form.origin?.trim()) newErrors.origin = "Origin Airport is required";
    if (!form.destination?.trim()) newErrors.destination = "Destination Airport is required";
    if (!form.commodity?.trim()) newErrors.commodity = "Item Type is required";

    if (!form.weight?.trim()) {
      newErrors.weight = "Weight is required";
    } else {
      const w = Number(form.weight);
      if (isNaN(w) || w <= 0) {
        newErrors.weight = "Weight must be a positive number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setGeneralError("");

    const newData = {

      awb: generateAWB(),

      sender_name: form.sender_name,

      receiver_name: form.receiver_name,

      phone: form.phone,

      origin_city: form.origin,

      destination_city: form.destination,

      item_type: form.commodity,

      weight: Number(form.weight),

      price: totalPrice,

      shipping_type: form.shipping_type,

      shipping_status: form.shipping_status,

      notes: form.notes,

      vehicle_id: Number(form.vehicle_id),

    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "/api/create-shipment",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(newData),

        }
      );

      const result = await response.json();
      if (response.ok) {

        setShipments((prev) => [formatShipment(result.data), ...prev]);
        setShowForm(false);
        setEditingIndex(null);
        setErrors({});
        setGeneralError("");

      } else {
        setGeneralError(result.error || "Failed to create shipment");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }

  };

  // ================= EDIT =================

  const handleEdit = (
    item: any,
    index: number
  ) => {

    setEditingIndex(index);
    setErrors({});
    setGeneralError("");

    const originCity = item.origin_city || item.origin;
    const destCity = item.destination_city || item.destination;
    const originApt = resolveAirport(originCity);
    const destApt = resolveAirport(destCity);

    setForm({

      sender_name: item.sender_name || "",

      receiver_name: item.receiver_name || "",

      phone: item.phone || "",

      origin: originCity ? `${originApt.code} - ${originApt.city}` : "",

      destination: destCity ? `${destApt.code} - ${destApt.city}` : "",

      commodity: item.item_type || item.commodity || "",

      weight: String(item.weight || ""),

      shipping_type: item.shipping_type || "Biasa",

      shipping_status: item.shipping_status || item.status || "Received",

      notes: item.notes || "",

      vehicle_id: String(item.vehicle_id || "1"),

    });

    setShowForm(true);

    setTimeout(() => {
      const formEl = document.getElementById("shipment-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
        formEl.classList.add("ring-4", "ring-green-500/50", "transition-all", "duration-500");
        setTimeout(() => {
          formEl.classList.remove("ring-4", "ring-green-500/50");
        }, 1500);
      }
      const firstInput = document.getElementById("sender-name-input");
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);

  };

  // ================= UPDATE =================

  const handleUpdateShipment = async () => {

    if (editingIndex === null) return;

    const newErrors: Record<string, string> = {};
    if (!form.sender_name?.trim()) newErrors.sender_name = "Sender Name is required";
    if (!form.receiver_name?.trim()) newErrors.receiver_name = "Receiver Name is required";
    if (!form.phone?.trim()) newErrors.phone = "Phone Number is required";
    if (!form.origin?.trim()) newErrors.origin = "Origin City is required";
    if (!form.destination?.trim()) newErrors.destination = "Destination City is required";
    if (!form.commodity?.trim()) newErrors.commodity = "Item Type is required";

    if (!form.weight?.trim()) {
      newErrors.weight = "Weight is required";
    } else {
      const w = Number(form.weight);
      if (isNaN(w) || w <= 0) {
        newErrors.weight = "Weight must be a positive number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setGeneralError("");

    const shipment = shipments[editingIndex];

    const updatedData = {

      id: shipment.id,

      sender_name: form.sender_name,

      receiver_name: form.receiver_name,

      phone: form.phone,

      origin_city: form.origin,

      destination_city: form.destination,

      item_type: form.commodity,

      weight: Number(form.weight),

      price: totalPrice,

      shipping_type: form.shipping_type,

      shipping_status: form.shipping_status,

      notes: form.notes,

      vehicle_id: Number(form.vehicle_id),

    };

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "/api/update-shipment",
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedData),

        }
      );

      const result = await response.json();
      if (response.ok) {

        setShipments((prev) => {
          const newArr = [...prev];
          newArr[editingIndex] = formatShipment(result.data);
          return newArr;
        });
        setShowForm(false);
        setEditingIndex(null);
        setErrors({});
        setGeneralError("");

      } else {
        setGeneralError(result.error || "Failed to update shipment");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to update shipment");
    } finally {
      setIsSubmitting(false);
    }

  };

  // ================= DELETE =================

  const handleDelete = async (
    index: number
  ) => {

    const shipment = shipments[index];

    const confirmDelete = window.confirm(
      `Delete shipment ${shipment.awb}?`
    );

    if (!confirmDelete) return;

    await fetch("/api/delete-shipment", {

      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        id: shipment.id,

      }),

    });

    const updated = shipments.filter(
      (_, i) => i !== index
    );

    setShipments(updated);

  };

  // ================= SEARCH =================

  const filteredShipments =
    shipments.filter((item) =>

      item.awb
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.sender_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.receiver_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.commodity
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, startIndex + itemsPerPage);

  // ================= STATUS STYLE =================

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "Received":
        return "bg-blue-100 text-blue-700";

      case "Sortation":
        return "bg-purple-100 text-purple-700";

      case "Loaded":
        return "bg-yellow-100 text-yellow-700";

      case "Departed":
        return "bg-indigo-100 text-indigo-700";

      case "Arrived":
        return "bg-green-100 text-green-700";

      case "Delayed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };


  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Shipments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all cargo shipment data
          </p>

        </div>

        <button
          onClick={() => {

            setEditingIndex(null);
            setErrors({});
            setGeneralError("");

            setForm({

              sender_name: "",

              receiver_name: "",

              phone: "",

              origin: "",

              destination: "",

              commodity: "",

              weight: "",

              shipping_type: "Biasa",

              shipping_status: "Sortation",

              notes: "",

              vehicle_id: "1",

            });

            setShowForm(true);

          }}

          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl shadow-lg"
        >
          + Create Shipment
        </button>

      </div>

      {/* SEARCH */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          type="text"
          placeholder="Search shipment..."
          className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md hover:border-slate-300"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* FORM */}

      {showForm && (

        <form 
          id="shipment-form"
          className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 mb-8 border border-slate-100 transition-all"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingIndex !== null) handleUpdateShipment();
            else handleSubmit();
          }}
        >

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {editingIndex !== null
              ? "Update Shipment"
              : "Create New Shipment"}

          </h2>


          <div className="space-y-8">
            
            {/* SENDER & RECEIVER */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Sender Name</label>
                  <input
                    id="sender-name-input"
                    value={form.sender_name}
                    placeholder="e.g. PT Logistics Indo"
                    onChange={(e) => {
                      setForm({ ...form, sender_name: e.target.value });
                      if (errors.sender_name) setErrors(prev => ({ ...prev, sender_name: "" }));
                    }}
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:border-slate-300 shadow-sm ${errors.sender_name ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.sender_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.sender_name}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Receiver Name</label>
                  <input
                    value={form.receiver_name}
                    placeholder="e.g. John Doe"
                    onChange={(e) => {
                      setForm({ ...form, receiver_name: e.target.value });
                      if (errors.receiver_name) setErrors(prev => ({ ...prev, receiver_name: "" }));
                    }}
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:border-slate-300 shadow-sm ${errors.receiver_name ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.receiver_name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.receiver_name}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    value={form.phone}
                    placeholder="+62..."
                    onChange={(e) => {
                      const val = e.target.value;
                      const numericVal = val.replace(/\D/g, '');
                      if (numericVal.length > 12) {
                        setErrors(prev => ({ ...prev, phone: "Phone number cannot exceed 12 digits." }));
                        setForm({ ...form, phone: numericVal.slice(0, 12) });
                      } else {
                        setErrors(prev => ({ ...prev, phone: "" }));
                        setForm({ ...form, phone: numericVal });
                      }
                    }}
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:border-slate-300 shadow-sm ${errors.phone ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* ROUTE INFORMATION */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Route Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ORIGIN */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Origin Airport</label>
                    <SearchableSelect
                      options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: `${apt.code} - ${apt.city}` }))}
                      value={form.origin}
                      onChange={(val) => {
                        setForm({ ...form, origin: val });
                        if (errors.origin) setErrors(prev => ({ ...prev, origin: "" }));
                      }}
                      placeholder="Select Origin Airport..."
                      searchPlaceholder="Search airports..."
                      error={!!errors.origin}
                    />
                    {errors.origin && <p className="text-red-500 text-xs mt-1 font-medium">{errors.origin}</p>}
                  </div>
                </div>

                {/* DESTINATION */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Destination Airport</label>
                    <SearchableSelect
                      options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: `${apt.code} - ${apt.city}` }))}
                      value={form.destination}
                      onChange={(val) => {
                        setForm({ ...form, destination: val });
                        if (errors.destination) setErrors(prev => ({ ...prev, destination: "" }));
                      }}
                      placeholder="Select Destination Airport..."
                      searchPlaceholder="Search airports..."
                      error={!!errors.destination}
                    />
                    {errors.destination && <p className="text-red-500 text-xs mt-1 font-medium">{errors.destination}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* SHIPMENT & TRANSPORT */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                Shipment & Transport Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Item Type</label>
                  <SearchableSelect
                    options={Object.values(ITEM_CATEGORIES).flat().map(item => ({ label: item, value: item }))}
                    value={form.commodity}
                    onChange={(val) => {
                      setForm({ ...form, commodity: val });
                      if (errors.commodity) setErrors(prev => ({ ...prev, commodity: "" }));
                    }}
                    placeholder="Select Category"
                    searchPlaceholder="Search category..."
                    error={!!errors.commodity}
                  />
                  {errors.commodity && <p className="text-red-500 text-xs mt-1 font-medium">{errors.commodity}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5.5"
                    value={form.weight}
                    onChange={(e) => {
                      setForm({ ...form, weight: e.target.value });
                      if (errors.weight) setErrors(prev => ({ ...prev, weight: "" }));
                    }}
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all hover:border-slate-300 shadow-sm ${errors.weight ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1 font-medium">{errors.weight}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Shipment Type</label>
                  <SearchableSelect
                    options={[
                      { label: "Biasa (Standard)", value: "Biasa" },
                      { label: "Express", value: "Express" },
                      { label: "VVIP Priority", value: "VVIP" }
                    ]}
                    value={form.shipping_type}
                    onChange={(val) => setForm({ ...form, shipping_type: val })}
                    placeholder="Select Shipment Type"
                    searchPlaceholder="Search..."
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Aircraft Allocation</label>
                  <SearchableSelect
                    options={[
                      { label: "Boeing 737 Cargo", value: "1" },
                      { label: "Airbus A330 Cargo", value: "2" }
                    ]}
                    value={form.vehicle_id}
                    onChange={(val) => setForm({ ...form, vehicle_id: val })}
                    placeholder="Select Aircraft"
                    searchPlaceholder="Search aircraft..."
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Current Status</label>
                  <SearchableSelect
                    options={SHIPMENT_STATUSES.map(status => ({ label: status, value: status }))}
                    value={form.shipping_status}
                    onChange={(val) => setForm({ ...form, shipping_status: val })}
                    placeholder="Select Status"
                    searchPlaceholder="Search status..."
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Internal Notes</label>
                  <input
                    value={form.notes}
                    placeholder="Optional descriptions or instructions..."
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
            
          </div>

          {/* PRICE CARD */}
          <div className="mt-8 bg-green-50/50 border border-green-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 w-full max-w-md">
              <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4 border-b border-green-200/50 pb-2">Estimated Quotation</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Base Price</span>
                  <span className="font-semibold text-slate-800">Rp {basePrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Shipment Type: <span className="font-bold">{form.shipping_type}</span></span>
                  <span className="font-semibold text-slate-800">Rp {extraPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-green-200/50 pt-4">
                <span className="text-slate-800 font-bold text-lg">Total Price</span>
                <span className="text-3xl font-extrabold text-green-700 tracking-tight">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3">
              {editingIndex !== null ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all text-white px-8 py-4 rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Shipment"
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all text-white px-8 py-4 rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    "Publish Shipment"
                  )}
                </button>
              )}
            </div>
          </div>

          {generalError && (
            <div className="mt-6 bg-red-50 border border-red-200 p-5 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-red-700 font-bold">{generalError}</span>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
                setErrors({});
                setGeneralError("");
              }}
              className="bg-slate-200 hover:bg-slate-300 hover:-translate-y-0.5 transition-all text-slate-700 font-bold px-6 py-3 rounded-xl"
            >
              Cancel & Close
            </button>
          </div>

        </form>

      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left table-auto">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">AWB</th>
                <th className="px-4 py-3 whitespace-nowrap">Route</th>
                <th className="px-4 py-3 whitespace-nowrap">Vehicle</th>
                <th className="px-4 py-3 whitespace-nowrap">Weight</th>
                <th className="px-4 py-3 whitespace-nowrap">Created / Updated</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedShipments.map((item, localIndex) => {
                const actualIndex = shipments.findIndex((s) => s.awb === item.awb);
                return (
                <tr key={item.awb || localIndex} className="bg-white group transition-colors duration-200 hover:bg-blue-50/40">
                  {/* AWB */}
                  <td className="px-4 py-3 font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    <button
                      onClick={() => setAwbPopup(item)}
                      className="font-mono font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors text-left"
                      title="View details"
                    >
                      {item.awb}
                    </button>
                  </td>

                  {/* ROUTE */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <span>{item.origin}</span>
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      <span>{item.destination}</span>
                    </div>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block">
                      {item.vehicle_name}
                    </div>
                  </td>

                  {/* WEIGHT */}
                  <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                    {item.weight} kg
                  </td>

                  {/* CREATED DATE */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-semibold text-sm">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-slate-500 text-xs font-medium">
                        {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} WIB
                      </span>
                      {item.updated_at && item.updated_at !== item.created_at && (
                        <span className="text-orange-600/90 text-[11px] font-bold tracking-wider mt-1 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Updated {new Date(item.updated_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} WIB
                        </span>
                      )}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item, actualIndex)}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all duration-200 cursor-pointer"
                        title="Edit Shipment"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                      </button>
                      <span className="text-slate-200 select-none">|</span>
                      <button
                        onClick={() => handleDelete(actualIndex)}
                        className="flex items-center gap-1 text-slate-600 hover:text-red-600 text-xs font-semibold transition-all duration-200 cursor-pointer"
                        title="Delete Shipment"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {/* PAGINATION UI */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredShipments.length)}</span> of <span className="font-bold text-slate-700">{filteredShipments.length}</span> shipments
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Previous
              </button>
              <div className="flex items-center justify-center px-4 font-bold text-slate-700 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AWB DETAIL POPUP */}
      {awbPopup && <AWBDetailModal shipment={awbPopup} onClose={() => setAwbPopup(null)} />}

    </DashboardLayout>

  );

}
