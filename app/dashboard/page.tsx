"use client";

import DashboardLayout from "../ui/layout-dashboard";
import Search from "../ui/search";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// register chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

// fix next.js chart
const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);

export default function Dashboard() {

  const [chartData, setChartData] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const shipmentsPerPage = 3;

  useEffect(() => {

    const timer = setTimeout(() => {

      setChartData({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

        datasets: [
          {
            label: "Shipments",
            data: [45, 55, 40, 70, 50, 35, 30],
            backgroundColor: "#2563eb",
            borderRadius: 6,
          },
        ],
      });

    }, 300);

    return () => clearTimeout(timer);

  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 1200,
      easing: "easeOutQuart" as const,
    },

    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // ================= SHIPMENT DATA =================

  const shipments = [

    {
      awb: "AWB-001",
      status: "Departed",
      destination: "CGK",
      time: "08:30",
      color: "text-blue-500",
    },

    {
      awb: "AWB-002",
      status: "Loaded",
      destination: "SIN",
      time: "09:15",
      color: "text-green-500",
    },

    {
      awb: "AWB-003",
      status: "Sortation",
      destination: "KUL",
      time: "10:00",
      color: "text-yellow-500",
    },

    {
      awb: "AWB-004",
      status: "Arrived",
      destination: "HKG",
      time: "07:45",
      color: "text-green-600",
    },

    {
      awb: "AWB-005",
      status: "Delayed",
      destination: "BKK",
      time: "11:30",
      color: "text-red-500",
    },

  ];

  // ================= SEARCH =================

  const filteredShipments = shipments.filter((item) =>

    item.awb.toLowerCase().includes(search.toLowerCase()) ||

    item.destination.toLowerCase().includes(search.toLowerCase()) ||

    item.status.toLowerCase().includes(search.toLowerCase())

  );

  // ================= PAGINATION =================

  const indexOfLastShipment = currentPage * shipmentsPerPage;

  const indexOfFirstShipment =
    indexOfLastShipment - shipmentsPerPage;

  const currentShipments = filteredShipments.slice(
    indexOfFirstShipment,
    indexOfLastShipment
  );

  const totalPages = Math.ceil(
    filteredShipments.length / shipmentsPerPage
  );

  return (
    <DashboardLayout>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              On-Time
            </p>

            <h2 className="text-2xl font-bold">
              28
            </h2>
          </div>

          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            ✔
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              Delayed
            </p>

            <h2 className="text-2xl font-bold">
              3
            </h2>
          </div>

          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            !
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              Departed
            </p>

            <h2 className="text-2xl font-bold">
              15
            </h2>
          </div>

          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            ✈
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              In Progress
            </p>

            <h2 className="text-2xl font-bold">
              12
            </h2>
          </div>

          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            ⏳
          </div>
        </div>

      </div>

      {/* ================= CHART ================= */}

      <div className="bg-white p-6 rounded shadow h-[400px] mb-6">

        <h2 className="mb-4 font-semibold">
          Weekly Shipments
        </h2>

        <Suspense fallback={<p>Loading Chart...</p>}>

          {chartData && (
            <Bar data={chartData} options={options} />
          )}

        </Suspense>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white p-6 rounded shadow mt-6">

        <div className="flex justify-between mb-4">

          <h2 className="font-semibold">
            Daily Cargo Shipments
          </h2>

          <span className="text-sm text-gray-400">
            {filteredShipments.length} entries
          </span>

        </div>

        {/* ================= SEARCH ================= */}

        <Search
          search={search}
          setSearch={setSearch}
        />

        {/* ================= TABLE ================= */}

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b">

            <tr>
              <th className="text-left p-2">AWB</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Destination</th>
              <th className="text-left p-2">Time</th>
            </tr>

          </thead>

          <tbody>

            {currentShipments.map((item, index) => (

              <tr
                key={index}
                className="border-b"
              >

                <td className="p-2">
                  {item.awb}
                </td>

                <td>
                  <span className={item.color}>
                    {item.status}
                  </span>
                </td>

                <td>
                  {item.destination}
                </td>

                <td>
                  {item.time}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* ================= PAGINATION ================= */}

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}