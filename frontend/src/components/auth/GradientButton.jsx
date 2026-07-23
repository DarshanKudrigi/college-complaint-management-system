import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

export function GradientButton({
  children,
  type = "submit",
  loading = false,
  loadingText,
  disabled = false,
  onClick,
  showArrow = true,
  className = "",
  fullWidth = true,
  ...props
}) {
  const isButtonDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={`group relative flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 ease-out select-none shadow-md ${
        isButtonDisabled
          ? "bg-blue-400 cursor-not-allowed opacity-75 shadow-none"
          : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35"
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {/* Glow highlight */}
      <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none" />

      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {showArrow && (
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </>
      )}
    </button>
  );
}

export default GradientButton;
