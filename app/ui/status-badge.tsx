import React from "react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let badgeClasses = "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20";
  let dotClasses = "bg-current opacity-70";

  switch (status) {
    case "Received":
      badgeClasses = "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";
      break;
    case "Loaded":
      badgeClasses = "bg-green-50 text-green-700 ring-1 ring-green-600/20";
      break;
    case "Sortation":
      badgeClasses = "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20";
      break;
    case "Departed":
      badgeClasses = "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20";
      break;
    case "Arrived":
      badgeClasses = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
      dotClasses = "bg-emerald-500";
      break;
    case "Delayed":
      badgeClasses = "bg-red-50 text-red-700 ring-1 ring-red-600/20 animate-pulse";
      dotClasses = "bg-red-500";
      break;
    case "Pending":
      badgeClasses = "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20";
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${badgeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClasses}`}></span>
      {status}
    </span>
  );
}
