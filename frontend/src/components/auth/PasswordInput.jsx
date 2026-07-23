import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import InputField from "./InputField";

export function PasswordInput({
  id,
  name = "password",
  label = "Password",
  placeholder = "••••••••",
  value,
  onChange,
  required = true,
  error,
  helperText,
  disabled = false,
  autoComplete = "current-password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const EyeButton = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="p-1.5 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-blue-600 transition-colors rounded-lg"
      aria-label={showPassword ? "Hide password" : "Show password"}
      tabIndex={0}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
      ) : (
        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
      )}
    </button>
  );

  return (
    <InputField
      id={id || `password-${name}`}
      name={name}
      type={showPassword ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      icon={Lock}
      endElement={EyeButton}
      error={error}
      helperText={helperText}
      disabled={disabled}
      autoComplete={autoComplete}
      {...props}
    />
  );
}

export default PasswordInput;
