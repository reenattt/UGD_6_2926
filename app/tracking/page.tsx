"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState } from "react";

export default function Tracking() {
  const [awb, setAwb] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "notfound">("idle");

  const validAWB = ["AWB-001"];

  const handleTrack = () => {
    if (validAWB.includes(awb)) {
      setStatus("found");
    } else {
      setStatus("notfound");
    }
  };

  return (
    <DashboardLayout>

      <div className="bg-white p-6 rounded shadow mb-6 flex gap-4">
        <input
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          placeholder="Enter AWB number (e.g., AWB-001)"
          className="flex-1 border p-3 rounded outline-blue-500"
        />

        <button
          onClick={handleTrack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded"
        >
          Track
        </button>
      </div>

      {status === "idle" && (
        <div className="text-center text-gray-400 mt-10">
          Enter AWB to track
        </div>
      )}

      {status === "notfound" && (
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white p-10 rounded shadow text-center w-[400px]">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ❌
            </div>
            <h2 className="font-semibold text-lg mb-2">
              AWB Number Not Found
            </h2>
            <p className="text-gray-400 text-sm">
              We couldn't find any shipment with that AWB number.
            </p>
          </div>
        </div>
      )}

      {status === "found" && (
        <div className="bg-white p-8 rounded shadow">
          <h2 className="font-semibold text-lg mb-6">
            Tracking Result
          </h2>

          <div className="relative pl-6">
            <div className="absolute left-2 top-0 h-full w-[2px] bg-gray-300"></div>

            {["Received", "Sortation", "Loaded to Aircraft", "Departed", "Arrived (Pending)"].map((step, i) => (
              <div key={i} className="mb-6 flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full z-10 ${
                  i < 3 ? "bg-green-500" :
                  i === 3 ? "bg-blue-500" :
                  "bg-gray-300"
                }`}></div>
                <p className={`${i === 3 ? "text-blue-600 font-medium" : ""}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

    </DashboardLayout>
  );
}