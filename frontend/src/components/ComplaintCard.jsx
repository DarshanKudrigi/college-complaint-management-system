import React from "react";
import { ArrowRight, Clock, Building, Tag } from "lucide-react";

function statusStyles(status) {
  const normalized = String(status || "pending").toLowerCase();

  if (normalized === "in_progress") {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }

  if (normalized === "resolved") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }

  if (normalized === "rejected") {
    return "bg-red-100 text-red-800 border-red-200";
  }

  return "bg-amber-100 text-amber-800 border-amber-200";
}

function formatStatusLabel(status) {
  const normalized = String(status || "pending").toLowerCase();

  if (normalized === "in_progress") {
    return "In Progress";
  }

  if (normalized === "resolved") {
    return "Completed";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles(status)}`}>
      {formatStatusLabel(status)}
    </span>
  );
}

function ComplaintCard({ complaint, onClick }) {
  return (
    <button
      className="group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {complaint.title}
            </h3>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {complaint.description}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{complaint.category || "General"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{complaint.dept_name || "Department"}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{new Date(complaint.created_at || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-slate-500">
          Status: <span className="text-slate-800">{complaint.latest_status_label || formatStatusLabel(complaint.status)}</span>
        </span>

        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
          <span>View Details</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}

export default ComplaintCard;
