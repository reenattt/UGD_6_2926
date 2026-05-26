"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState } from "react";

export default function Manifest() {

  const [showForm, setShowForm] = useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [shipments, setShipments] =
    useState<any[]>([]);

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

    shipping_status: "Received",

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

    if (response.ok) {

      location.reload();

    }

  };

  // ================= EDIT =================

  const handleEdit = (
    item: any,
    index: number
  ) => {

    setEditingIndex(index);

    setForm({

      sender_name: item.sender_name,

      receiver_name: item.receiver_name,

      phone: item.phone,

      origin: item.origin,

      destination: item.destination,

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

    if (response.ok) {

      location.reload();

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

            setForm({

              sender_name: "",

              receiver_name: "",

              phone: "",

              origin: "",

              destination: "",

              commodity: "",

              weight: "",

              shipping_type: "Biasa",

              shipping_status: "Received",

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

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 border">

        <input
          type="text"
          placeholder="Search AWB / Sender / Receiver / Commodity"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition p-4 rounded-xl outline-none"
        />

      </div>

      {/* FORM */}

      {showForm && (

        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {editingIndex !== null
              ? "Update Shipment"
              : "Create New Shipment"}

          </h2>

          <div className="grid grid-cols-2 gap-5">

            <input
              placeholder="Sender Name"
              value={form.sender_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  sender_name: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              placeholder="Receiver Name"
              value={form.receiver_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  receiver_name: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              placeholder="Item Type"
              value={form.commodity}
              onChange={(e) =>
                setForm({
                  ...form,
                  commodity: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              placeholder="Origin City"
              value={form.origin}
              onChange={(e) =>
                setForm({
                  ...form,
                  origin: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              placeholder="Destination City"
              value={form.destination}
              onChange={(e) =>
                setForm({
                  ...form,
                  destination: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <input
              type="number"
              placeholder="Weight (kg)"
              value={form.weight}
              onChange={(e) =>
                setForm({
                  ...form,
                  weight: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            />

            <select
              value={form.shipping_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  shipping_type: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            >

              <option value="Biasa">
                Biasa
              </option>

              <option value="Express">
                Express
              </option>

              <option value="VVIP">
                VVIP
              </option>

            </select>

            <select
              value={form.shipping_status}
              onChange={(e) =>
                setForm({
                  ...form,
                  shipping_status: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            >

              {statusList.map((status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>

              ))}

            </select>

            <select
              value={form.vehicle_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  vehicle_id: e.target.value,
                })
              }
              className="border p-4 rounded-xl"
            >

              <option value="1">
                Boeing 737 Cargo
              </option>

              <option value="2">
                Airbus A330 Cargo
              </option>

            </select>

            <textarea
              placeholder="Notes / Description"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              className="border p-4 rounded-xl col-span-2"
              rows={4}
            />

          </div>

          {/* PRICE */}

          <div className="mt-6 bg-blue-50 p-5 rounded-xl">

            <h2 className="text-2xl font-bold text-blue-700">

              Total Price : Rp
              {totalPrice.toLocaleString("id-ID")}

            </h2>

          </div>

          {/* BUTTON */}

          <div className="flex gap-4 mt-6">

            {editingIndex !== null ? (

              <button
                onClick={handleUpdateShipment}
                className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-6 py-3 rounded-xl shadow"
              >
                Update Shipment
              </button>

            ) : (

              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl shadow"
              >
                Save Shipment
              </button>

            )}

            <button
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 transition px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden mt-8">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr className="text-gray-700">

              <th className="px-4 py-4 text-left">
                AWB
              </th>

              <th className="px-4 py-4 text-left">
                Sender
              </th>

              <th className="px-4 py-4 text-left">
                Receiver
              </th>

              <th className="px-4 py-4 text-left">
                Route
              </th>

              <th className="px-4 py-4 text-left">
                Vehicle
              </th>

              <th className="px-4 py-4 text-left">
                Commodity
              </th>

              <th className="px-4 py-4 text-left">
                Weight
              </th>

              <th className="px-4 py-4 text-left">
                Price
              </th>

              <th className="px-4 py-4 text-left">
                Created
              </th>

              <th className="px-4 py-4 text-left">
                Status
              </th>

              <th className="px-4 py-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredShipments.map(
              (item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* AWB */}

                  <td className="px-4 py-5 font-bold text-blue-700">
                    {item.awb}
                  </td>

                  {/* SENDER */}

                  <td className="px-4 py-5">
                    {item.sender_name}
                  </td>

                  {/* RECEIVER */}

                  <td className="px-4 py-5">
                    {item.receiver_name}
                  </td>

                  {/* ROUTE */}

                  <td className="px-4 py-5">

                    <div className="leading-relaxed">

                      <span>
                        {item.origin}
                      </span>

                      <span className="mx-1 text-gray-400">
                        →
                      </span>

                      <span>
                        {item.destination}
                      </span>

                    </div>

                  </td>

                  {/* VEHICLE */}

                  <td className="px-4 py-5">

                    <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-medium inline-block">

                      {item.vehicle_name}

                    </div>

                  </td>

                  {/* COMMODITY */}

                  <td className="px-4 py-5">
                    {item.commodity}
                  </td>

                  {/* WEIGHT */}

                  <td className="px-4 py-5">
                    {item.weight} Kg
                  </td>

                  {/* PRICE */}

                  <td className="px-4 py-5 font-bold text-green-600">

                    Rp{" "}
                    {Number(item.price).toLocaleString(
                      "id-ID"
                    )}

                  </td>

                  {/* CREATED DATE */}

                  <td className="px-4 py-5 whitespace-nowrap">

                    {new Date(
                      item.created_at
                    ).toLocaleDateString("id-ID")}

                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-5">

                    <span
                      className={`px-3 py-2 rounded-full text-xs font-semibold inline-block ${getStatusColor(
                        item.status
                      )}`}
                    >

                      {item.status}

                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="px-4 py-5">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(item, index)
                        }
                        className="bg-yellow-400 hover:bg-yellow-500 transition px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Update
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(index)
                        }
                        className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg font-medium text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}