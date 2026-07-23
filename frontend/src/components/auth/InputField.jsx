import React, { useState } from "react";

export function InputField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  endElement,
  error,
  helperText,
  disabled = false,
  autoComplete,
  className = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${name}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 ml-0.5"
        >
          {label} {required && <span className="text-blue-600">*</span>}
        </label>
      )}

      <div className="relative flex items-center group">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border bg-white/90 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all duration-200 outline-none ${
            Icon ? "pl-11" : "pl-4"
          } ${endElement ? "pr-11" : "pr-4"} ${
            error
              ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
              : "border-slate-200/90 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/15 shadow-sm"
          } ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
          {...props}
        />

        {endElement && (
          <div className="absolute right-3 flex items-center">
            {endElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium ml-1 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 ml-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default InputField;
