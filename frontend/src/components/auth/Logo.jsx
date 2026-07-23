import React from "react";
import { ShieldCheck } from "lucide-react";

export function Logo({ title = "College Complaint Management", subtitle = "Welcome back", size = "md" }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-3 group">
        {/* Glow Ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 opacity-70 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />
        
        {/* Logo Box */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-md ring-1 ring-white/30 text-white font-black text-xl tracking-wider">
          <span className="bg-gradient-to-t from-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
            CC
          </span>
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
            <ShieldCheck className="h-3 w-3" />
          </div>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default Logo;
