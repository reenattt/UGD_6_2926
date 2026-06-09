"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState } from "react";
import { ITEM_CATEGORIES } from "../lib/definitions";
import { AIRPORT_MASTER_DATA } from "../lib/airports";
import { SearchableSelect } from "../ui/searchable-select";

export default function Manifest() {

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [shipments, setShipments] =
    useState<any[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [generalError, setGeneralError] = useState("");

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

        const formatted = data.map((item: any) => ({

          id: item.id,

          awb: item.awb,

          sender_name: item.sender_name,

          receiver_name: item.receiver_name,

          phone: item.phone,

          origin: item.origin_city,

          destination: item.destination_city,

          commodity: item.item_type,

          weight: item.weight,

          price: item.price,

          shipping_type: item.shipping_type,

          status: item.shipping_status,

          notes: item.notes,

          vehicle_id: item.vehicle_id,

          vehicle_name:
            item.vehicle_id == 1
              ? "Boeing 737 Cargo"
              : "Airbus A330 Cargo",

          created_at: item.shipping_date,

        }));

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
      ? 20000
      : form.shipping_type === "VVIP"
        ? 50000
        : 0;

  const totalPrice =
    basePrice + extraPrice;

  // ================= CREATE =================

  const handleSubmit = async () => {

    const newErrors: Record<string, string> = {};
    if (!form.sender_name.trim()) newErrors.sender_name = "Sender Name is required";
    if (!form.receiver_name.trim()) newErrors.receiver_name = "Receiver Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!form.origin.trim()) newErrors.origin = "Origin Airport is required";
    if (!form.destination.trim()) newErrors.destination = "Destination Airport is required";
    if (!form.commodity.trim()) newErrors.commodity = "Item Type is required";

    if (!form.weight.trim()) {
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

        location.reload();

      } else {
        setGeneralError(result.error || "Failed to create shipment");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to create shipment");
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

    setForm({

      sender_name: item.sender_name,

      receiver_name: item.receiver_name,

      phone: item.phone,

      origin: item.origin_city || "",

      destination: item.destination_city || "",

      commodity: item.commodity,

      weight: String(item.weight),

      shipping_type: item.shipping_type,

      shipping_status: item.status,

      notes: item.notes,

      vehicle_id: String(item.vehicle_id || "1"),

    });

    setShowForm(true);

  };

  // ================= UPDATE =================

  const handleUpdateShipment = async () => {

    if (editingIndex === null) return;

    const newErrors: Record<string, string> = {};
    if (!form.sender_name.trim()) newErrors.sender_name = "Sender Name is required";
    if (!form.receiver_name.trim()) newErrors.receiver_name = "Receiver Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!form.origin.trim()) newErrors.origin = "Origin City is required";
    if (!form.destination.trim()) newErrors.destination = "Destination City is required";
    if (!form.commodity.trim()) newErrors.commodity = "Item Type is required";

    if (!form.weight.trim()) {
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

        location.reload();

      } else {
        setGeneralError(result.error || "Failed to update shipment");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to update shipment");
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

  const statusList = [

    "Received",

    "Sortation",

    "Loaded",

    "Departed",

    "Arrived",

    "Delayed",

  ];

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
      <div className="bg-white p-2 rounded-2xl shadow-md mb-8 flex gap-2 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        <div className="pl-6 pr-2 py-4 flex items-center text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          type="text"
          placeholder="Search AWBs, Senders, Destinations..."
          className="flex-1 bg-transparent py-4 pr-4 outline-none font-medium text-slate-800 text-base placeholder:text-slate-400"
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
          className="bg-white p-8 rounded-2xl shadow-lg mb-8 border"
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
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Sender Name</label>
                  <input
                    value={form.sender_name}
                    placeholder="e.g. PT Logistics Indo"
                    onChange={(e) => {
                      setForm({ ...form, sender_name: e.target.value });
                      if (errors.sender_name) setErrors(prev => ({ ...prev, sender_name: "" }));
                    }}
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.sender_name ? "border-red-500" : "border-slate-200"}`}
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
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.receiver_name ? "border-red-500" : "border-slate-200"}`}
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
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.phone ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* ROUTE INFORMATION */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
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
                      options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: apt.code }))}
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
                      options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: apt.code }))}
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
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
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
                    className={`border px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.weight ? "border-red-500" : "border-slate-200"}`}
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
                    options={statusList.map(status => ({ label: status, value: status }))}
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
          <div className="mt-8 bg-green-50/50 border border-green-200 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Estimated Quotation</p>
              <h2 className="text-3xl font-bold text-slate-800">
                Rp {totalPrice.toLocaleString("id-ID")}
              </h2>
            </div>
            {editingIndex !== null ? (
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 hover:-translate-y-0.5 transition-all text-white px-8 py-3.5 rounded-xl shadow-lg font-bold"
              >
                Update Shipment
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 transition-all text-white px-8 py-3.5 rounded-xl shadow-lg font-bold"
              >
                Publish Shipment
              </button>
            )}
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
                <th className="px-5 py-5 whitespace-nowrap">AWB</th>
                <th className="px-5 py-5 whitespace-nowrap">Sender</th>
                <th className="px-5 py-5 whitespace-nowrap">Receiver</th>
                <th className="px-5 py-5 whitespace-nowrap">Route</th>
                <th className="px-5 py-5 whitespace-nowrap">Vehicle</th>
                <th className="px-5 py-5 whitespace-nowrap">Commodity</th>
                <th className="px-5 py-5 whitespace-nowrap">Weight</th>
                <th className="px-5 py-5 whitespace-nowrap">Price</th>
                <th className="px-5 py-5 whitespace-nowrap">Created</th>
                <th className="px-5 py-5 text-center whitespace-nowrap">Status</th>
                <th className="px-5 py-5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedShipments.map((item, localIndex) => {
                const actualIndex = shipments.findIndex((s) => s.awb === item.awb);
                return (
                <tr key={item.awb || localIndex} className="hover:bg-slate-50/80 transition-colors bg-white group">
                  {/* AWB */}
                  <td className="px-5 py-4 font-bold text-slate-900 tracking-tight whitespace-nowrap">
                    {item.awb}
                  </td>

                  {/* SENDER */}
                  <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                    {item.sender_name}
                  </td>

                  {/* RECEIVER */}
                  <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">
                    {item.receiver_name}
                  </td>

                  {/* ROUTE */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <span>{item.origin}</span>
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      <span>{item.destination}</span>
                    </div>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-block">
                      {item.vehicle_name}
                    </div>
                  </td>

                  {/* COMMODITY */}
                  <td className="px-5 py-4 text-slate-700 font-medium whitespace-nowrap">
                    {item.commodity}
                  </td>

                  {/* WEIGHT */}
                  <td className="px-5 py-4 font-semibold text-slate-700 whitespace-nowrap">
                    {item.weight} kg
                  </td>

                  {/* PRICE */}
                  <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </td>

                  {/* CREATED DATE */}
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-medium">
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap
                        ${item.status === "Received" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20" :
                          item.status === "Loaded" ? "bg-green-50 text-green-700 ring-1 ring-green-600/20" :
                          item.status === "Sortation" ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20" :
                          item.status === "Arrived" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" :
                          item.status === "Delayed" ? "bg-red-50 text-red-700 ring-1 ring-red-600/20 animate-pulse" :
                          "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        item.status === "Arrived" ? "bg-emerald-500" :
                        item.status === "Delayed" ? "bg-red-500" :
                        "bg-current opacity-70"
                      }`}></span>
                      {item.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item, actualIndex)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-blue-100"
                        title="Edit Shipment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>

                      <button
                        onClick={() => handleDelete(actualIndex)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 border border-transparent hover:border-red-100"
                        title="Delete Shipment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

    </DashboardLayout>

  );

}
