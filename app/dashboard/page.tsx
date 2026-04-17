"use client";

import DashboardLayout from "../ui/layout-dashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// 🔥 REGISTER WAJIB
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// 🔥 FIX NEXT.JS (WAJIB)
const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);

export default function Dashboard() {

  // 🔥 STATE UNTUK PAKSA ANIMASI
  const [chartData, setChartData] = useState<any>(null);

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
    }, 300); // delay biar animasi ke-trigger

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

  return (
    <DashboardLayout>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">On-Time</p>
            <h2 className="text-2xl font-bold">28</h2>
          </div>
          <div className="bg-green-100 text-green-600 p-3 rounded-full">✔</div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Delayed</p>
            <h2 className="text-2xl font-bold">3</h2>
          </div>
          <div className="bg-red-100 text-red-600 p-3 rounded-full">!</div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Departed</p>
            <h2 className="text-2xl font-bold">15</h2>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">✈</div>
        </div>

        <div className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <h2 className="text-2xl font-bold">12</h2>
          </div>
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">⏳</div>
        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="bg-white p-6 rounded shadow h-[400px]">
        <h2 className="mb-4 font-semibold">Weekly Shipments</h2>

        {/* 🔥 AKAN ANIMASI */}
        {chartData && <Bar data={chartData} options={options} />}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded shadow mt-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Daily Cargo Shipments</h2>
          <span className="text-sm text-gray-400">5 entries</span>
        </div>

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
            <tr className="border-b">
              <td className="p-2">AWB-001</td>
              <td><span className="text-blue-500">Departed</span></td>
              <td>CGK</td>
              <td>08:30</td>
            </tr>

            <tr className="border-b">
              <td className="p-2">AWB-002</td>
              <td><span className="text-green-500">Loaded</span></td>
              <td>SIN</td>
              <td>09:15</td>
            </tr>

            <tr className="border-b">
              <td className="p-2">AWB-003</td>
              <td><span className="text-yellow-500">Sortation</span></td>
              <td>KUL</td>
              <td>10:00</td>
            </tr>

            <tr className="border-b">
              <td className="p-2">AWB-004</td>
              <td><span className="text-green-600">Arrived</span></td>
              <td>HKG</td>
              <td>07:45</td>
            </tr>

            <tr>
              <td className="p-2">AWB-005</td>
              <td><span className="text-red-500">Delayed</span></td>
              <td>BKK</td>
              <td>11:30</td>
            </tr>
          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}