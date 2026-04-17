"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState } from "react";

export default function Manifest() {

  const [showForm, setShowForm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [shipments, setShipments] = useState([
    {
      awb: "AWB-2026-001234",
      origin: "SUB",
      destination: "CGK",
      commodity: "General Cargo",
      weight: "120 kg",
      status: "Departed",
      time: "07 Apr, 08:31",
    },
    {
      awb: "AWB-2026-001235",
      origin: "CGK",
      destination: "SIN",
      commodity: "Documents",
      weight: "45 kg",
      status: "Loaded",
      time: "07 Apr, 09:10",
    },
  ]);

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    commodity: "",
    weight: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const statusList = ["Received", "Sortation", "Loaded", "Departed", "Arrived", "Delayed"];

  // GENERATE AWB
  const generateAWB = () => {
    const base = 1234 + shipments.length;
    return `AWB-2026-${String(base).padStart(6, "0")}`;
  };

  // CREATE
  const handleSubmit = () => {
    const newData = {
      awb: generateAWB(),
      ...form,
      status: "Received",
      time: "Now",
    };

    setShipments([...shipments, newData]);

    setForm({
      origin: "",
      destination: "",
      commodity: "",
      weight: "",
    });

    setShowForm(false);
  };

  // UPDATE STATUS
  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...shipments];
    updated[index].status = newStatus;
    updated[index].time = "Updated";
    setShipments(updated);
    setEditingIndex(null);
  };

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipments</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Shipment
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">

          <input
            placeholder="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Commodity"
            value={form.commodity}
            onChange={(e) => setForm({ ...form, commodity: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Weight"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="border p-2 rounded"
          />

          <div className="col-span-2 flex gap-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* TABLE */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="font-semibold mb-4">Daftar Shipment</h2>

        <table className="w-full text-left">

          <thead>
            <tr className="text-gray-500">
              <th>AWB Number</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Commodity</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((item, index) => (
              <tr key={index} className="border-t">

                <td>{item.awb}</td>
                <td>{item.origin}</td>
                <td>{item.destination}</td>
                <td>{item.commodity}</td>
                <td>{item.weight}</td>

                {/* STATUS */}
                <td>
                  {editingIndex === index ? (
                    <select
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                      defaultValue={item.status}
                      className="border p-1 rounded"
                    >
                      {statusList.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.status === "Departed"
                          ? "bg-blue-100 text-blue-600"
                          : item.status === "Loaded"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Sortation"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "Arrived"
                          ? "bg-green-200 text-green-700"
                          : item.status === "Delayed"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </td>

                <td>{item.time}</td>

                {/* ACTION */}
                <td className="flex gap-2">

                  {editingIndex === index ? (
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="bg-yellow-400 px-3 py-1 rounded text-sm"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => setDeleteIndex(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ===== MODAL DELETE ===== */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded shadow w-[350px] text-center">

            <h2 className="text-lg font-semibold mb-3">
              Konfirmasi Hapus
            </h2>

            <p className="text-gray-500 mb-5">
              Apakah kamu yakin ingin menghapus shipment ini?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const updated = shipments.filter((_, i) => i !== deleteIndex);
                  setShipments(updated);
                  setDeleteIndex(null);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}