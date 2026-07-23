import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm text-sm">
            CC
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              College Complaint System
            </h1>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Student & Admin Portal
            </p>
          </div>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  {user.student_id || user.dept_name || user.email || "User"}
                </p>
              </div>
            </div>
          )}
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 active:bg-red-800"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
