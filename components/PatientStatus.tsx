import React from "react";

type Status = "active" | "inactive" | "submitted" | "waiting";

interface PatientStatusProps {
  status: Status;
}

export default function PatientStatus({ status }: PatientStatusProps) {
  let badgeColor = "bg-gray-100 text-gray-800 border-gray-200";
  let label = "Waiting";
  let dotColor = "bg-gray-400";

  switch (status) {
    case "active":
      badgeColor = "bg-green-100 text-green-800 border-green-200";
      label = "Active";
      dotColor = "bg-green-500 animate-pulse";
      break;
    case "inactive":
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
      label = "Inactive";
      dotColor = "bg-yellow-500";
      break;
    case "submitted":
      badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
      label = "Submitted";
      dotColor = "bg-blue-500";
      break;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${badgeColor} font-medium text-sm transition-colors duration-300`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      {label}
      {status === "active" && (
        <span className="flex items-center gap-0.5 ml-1">
          <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-1 bg-green-600 rounded-full animate-bounce"></span>
        </span>
      )}
    </div>
  );
}
