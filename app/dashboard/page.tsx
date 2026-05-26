"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [shipments, setShipments] = useState<any[]>([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  // ================= FETCH DATABASE =================

  useEffect(() => {

    fetch("/api/shipments")

      .then((res) => res.json())

      .then((data) => {

        setShipments(data);

      });

  }, []);

  // ================= STATISTICS =================

  const totalShipments = shipments.length;

  const deliveredCount = shipments.filter(

    (item) =>
      item.shipping_status === "Arrived"

  ).length;

  const delayedCount = shipments.filter(

    (item) =>
      item.shipping_status === "Delayed"

  ).length;

  const inProgressCount = shipments.filter(

    (item) =>

      item.shipping_status !== "Arrived"

  ).length;

  const totalRevenue = shipments.reduce(

    (acc, item) => acc + Number(item.price || 0),

    0

  );

  // ================= REAL WEEKLY DATA =================

  const weeklyData = [

    { day: "Mon", total: 0 },

    { day: "Tue", total: 0 },

    { day: "Wed", total: 0 },

    { day: "Thu", total: 0 },

    { day: "Fri", total: 0 },

    { day: "Sat", total: 0 },

    { day: "Sun", total: 0 },

  ];

  shipments.forEach((item) => {

    const date = new Date(item.shipping_date);

    const day = date.getDay();

    // Minggu = 0
    // Senin = 1

    switch (day) {

      case 1:
        weeklyData[0].total += 1;
        break;

      case 2:
        weeklyData[1].total += 1;
        break;

      case 3:
        weeklyData[2].total += 1;
        break;

      case 4:
        weeklyData[3].total += 1;
        break;

      case 5:
        weeklyData[4].total += 1;
        break;

      case 6:
        weeklyData[5].total += 1;
        break;

      case 0:
        weeklyData[6].total += 1;
        break;

    }

  });

  // ================= PAGINATION =================

  const totalPages = Math.ceil(
    shipments.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentShipments =
    shipments.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Cargo shipment monitoring system
        </p>

      </div>

      {/* TOP CARDS */}

      <div className="grid grid-cols-5 gap-4 mb-6">

        {/* TOTAL SHIPMENT */}

        <div className="bg-white p-5 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-2">
            Total Shipments
          </p>

          <h2 className="text-3xl font-bold">
            {totalShipments}
          </h2>

        </div>

        {/* DELIVERED */}

        <div className="bg-white p-5 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-2">
            Delivered
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {deliveredCount}
          </h2>

        </div>

        {/* DELAYED */}

        <div className="bg-white p-5 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-2">
            Delayed
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            {delayedCount}
          </h2>

        </div>

        {/* IN PROGRESS */}

        <div className="bg-white p-5 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-2">
            In Progress
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {inProgressCount}
          </h2>

        </div>

        {/* REVENUE */}

        <div className="bg-white p-5 rounded-xl shadow">

          <p className="text-gray-500 text-sm mb-2">
            Revenue
          </p>

          <h2 className="text-2xl font-bold text-yellow-600">

            Rp
            {totalRevenue.toLocaleString("id-ID")}

          </h2>

        </div>

      </div>

      {/* WEEKLY SHIPMENT */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-bold mb-6">

          Weekly Shipments

        </h2>

        <div className="flex items-end justify-between h-[300px] gap-4">

          {weeklyData.map((item, index) => (

            <div
              key={index}
              className="flex flex-col items-center flex-1"
            >

              <div

                className="bg-blue-500 rounded-t-lg w-full transition-all duration-300 hover:bg-blue-600"

                style={{
                  height: `${item.total * 10}px`,
                }}

              ></div>

              <p className="mt-3 text-sm text-gray-500">

                {item.day}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* RECENT SHIPMENTS */}

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-bold">

            Recent Shipments

          </h2>

          <p className="text-sm text-gray-400">

            {shipments.length} entries

          </p>

        </div>

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b text-gray-500">

              <th className="py-3 text-left">
                AWB
              </th>

              <th className="py-3 text-left">
                Sender
              </th>

              <th className="py-3 text-left">
                Receiver
              </th>

              <th className="py-3 text-left">
                Destination
              </th>

              <th className="py-3 text-left">
                Status
              </th>

              <th className="py-3 text-left">
                Price
              </th>

              <th className="py-3 text-left">
                Created
              </th>

            </tr>

          </thead>

          <tbody>

            {currentShipments.map((item, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4 font-medium">

                  {item.awb}

                </td>

                <td>

                  {item.sender_name}

                </td>

                <td>

                  {item.receiver_name}

                </td>

                <td>

                  {item.destination_city}

                </td>

                <td>

                  <span

                    className={`px-3 py-1 rounded-full text-xs font-semibold

                    ${item.shipping_status === "Received"

                        ? "bg-blue-100 text-blue-700"

                        : item.shipping_status === "Loaded"

                          ? "bg-green-100 text-green-700"

                          : item.shipping_status === "Sortation"

                            ? "bg-yellow-100 text-yellow-700"

                            : item.shipping_status === "Arrived"

                              ? "bg-emerald-100 text-emerald-700"

                              : item.shipping_status === "Delayed"

                                ? "bg-red-100 text-red-700"

                                : "bg-gray-100 text-gray-700"

                      }

                  `}
                  >

                    {item.shipping_status}

                  </span>

                </td>

                <td className="font-semibold text-blue-600">

                  Rp
                  {Number(item.price).toLocaleString(
                    "id-ID"
                  )}

                </td>

                <td>

                  {new Date(
                    item.shipping_date
                  ).toLocaleDateString("id-ID")}

                </td>

              </tr>

            ))}

          </tbody>

        </table>
        {/* PAGINATION */}

        <div className="flex justify-between items-center mt-6">

          <p className="text-sm text-gray-500">

            Page {currentPage} of {totalPages}

          </p>

          <div className="flex gap-3">

            {/* PREVIOUS */}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {/* NEXT */}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}