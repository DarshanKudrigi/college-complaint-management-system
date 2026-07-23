import React from "react";
import { User, Shield } from "lucide-react";

export function RoleSwitcher({ activeTab, onChange }) {
  const isStudent = activeTab === "student";

  return (
    <div className="relative mb-6 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-inner">
      {/* Sliding Background Pill */}
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-white shadow-md shadow-blue-500/10 border border-slate-200/50 transition-all duration-300 ease-out ${
          isStudent ? "left-1.5" : "left-[calc(50%+3px)]"
        }`}
      />

      {/* Buttons Container */}
      <div className="relative flex items-center text-sm font-semibold">
        <button
          type="button"
          onClick={() => onChange("student")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 select-none ${
            isStudent
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-selected={isStudent}
          role="tab"
        >
          <User className={`h-4 w-4 transition-transform duration-200 ${isStudent ? "scale-110 text-blue-600" : "text-slate-400"}`} />
          <span>Student</span>
        </button>

        <button
          type="button"
          onClick={() => onChange("admin")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 select-none ${
            !isStudent
              ? "text-blue-600 font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
          aria-selected={!isStudent}
          role="tab"
        >
          <Shield className={`h-4 w-4 transition-transform duration-200 ${!isStudent ? "scale-110 text-blue-600" : "text-slate-400"}`} />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
}

export default RoleSwitcher;
