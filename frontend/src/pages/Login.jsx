import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Mail, AlertCircle, Sparkles } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Logo from "../components/auth/Logo";
import RoleSwitcher from "../components/auth/RoleSwitcher";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";
import GradientButton from "../components/auth/GradientButton";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("student");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(activeTab, form);
      login(data.token, data.user);
      setTimeout(() => {
        navigate(activeTab === "admin" ? "/admin" : "/dashboard");
      }, 100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Logo & Header */}
        <Logo
          title="College Complaint System"
          subtitle={activeTab === "student" ? "Welcome back! Sign in as Student" : "Welcome back! Sign in as Administrator"}
        />

        <div className="my-6">
          {/* Role Switcher (Segmented Control) */}
          <RoleSwitcher activeTab={activeTab} onChange={handleTabChange} />
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="student@college.edu"
            value={form.email}
            onChange={handleChange}
            icon={Mail}
            required
            autoComplete="email"
          />

          <div>
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            {/* Forgot Password Link */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200/80 bg-red-50/80 p-3.5 text-xs font-semibold text-red-700 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Submit Button */}
          <div className="pt-2">
            <GradientButton
              type="submit"
              loading={loading}
              loadingText="Signing in..."
            >
              Sign In as {activeTab === "admin" ? "Admin" : "Student"}
            </GradientButton>
          </div>
        </form>

        {/* Register Link Footer */}
        {activeTab === "student" ? (
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all ml-1"
              to="/register"
            >
              Register now
            </Link>
          </div>
        ) : (
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Administrator secure access level</span>
          </div>
        )}
      </AuthCard>

      {/* Forgot Password Guidance Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </AuthLayout>
  );
}

export default Login;
