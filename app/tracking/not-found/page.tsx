"use client";

import DashboardLayout from "../../ui/layout-dashboard";
import { useRouter } from "next/navigation";

export default function TrackingNotFound() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-lg w-full text-center">

          {/* SVG Illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Floating X badge */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              {/* Decorative orbit */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200 scale-125 animate-spin" style={{ animationDuration: "12s" }} />
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Shipment Not Found
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-2">
            The tracking number you entered does not exist in our system.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Please check that your AWB number is correct and try again.
          </p>

          {/* Hint box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-left">
            <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Tip</p>
            <p className="text-amber-700 text-sm">
              AWB numbers follow the format <span className="font-mono font-bold">AWB001</span>,{" "}
              <span className="font-mono font-bold">AWB015</span>,{" "}
              <span className="font-mono font-bold">AWB125</span>, etc.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              ← Go Back
            </button>
            <button
              onClick={() => router.push("/tracking")}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Return to Tracking
            </button>
          </div>
        </div>

        {/* Sub-text */}
        <p className="mt-6 text-slate-400 text-sm text-center">
          If you believe this is an error, please contact our{" "}
          <button onClick={() => router.push("/contact")} className="text-blue-500 hover:underline font-medium">
            support team
          </button>
          .
        </p>
      </div>
    </DashboardLayout>
  );
}
