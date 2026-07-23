import React from "react";
import IllustrationSection from "./IllustrationSection";

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-mesh-pattern font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* LEFT SIDE: Split Screen Illustration (~55%) */}
      <IllustrationSection />

      {/* RIGHT SIDE: Auth Form Center (~45%) */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-8 lg:p-12 min-h-screen relative overflow-y-auto">
        {/* Ambient Top Ambient Glow for Mobile/Desktop */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none" />

        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md">
              CC
            </div>
            <span className="font-bold text-slate-900 text-sm">Complaint System</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            Student & Admin Portal
          </span>
        </div>

        {/* Main Centered Form Container */}
        <div className="my-auto py-4 w-full flex justify-center">
          {children}
        </div>

        {/* Footer info for mobile/laptop */}
        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} College Complaint Management System</p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
