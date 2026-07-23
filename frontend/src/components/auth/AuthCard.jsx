import React from "react";

export function AuthCard({ children, className = "" }) {
  return (
    <div className={`w-full max-w-md mx-auto rounded-3xl bg-white/90 backdrop-blur-2xl p-7 sm:p-9 border border-white/80 shadow-2xl shadow-blue-500/10 animate-fade-up ${className}`}>
      {children}
    </div>
  );
}

export default AuthCard;
