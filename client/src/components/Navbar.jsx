import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Building2, FileSpreadsheet, LogOut } from "lucide-react";
import { logoutUser } from "../../config/api";
import { clearAuthSession, getAuthToken, getAuthUser } from "../utils/auth";

function linkClassName({ isActive }) {
  return [
    "block w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const user = useMemo(() => getAuthUser(), []);
  const canAccessEventDetails = ["admin", "faculty"].includes(user?.roleName);

  const handleLogout = async () => {
    const token = getAuthToken();

    try {
      if (token) {
        await logoutUser(token);
      }
    } catch {
    } finally {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 px-4 py-4">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Building2 size={18} className="text-slate-700" aria-hidden="true" />
          <span>BIT ICC</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Institute</p>
        <ul className="mt-2 space-y-1">
          {canAccessEventDetails && (
            <li>
              <NavLink to="/eventdetails" className={linkClassName}>
                <span className="flex items-center gap-2">
                  <FileSpreadsheet size={16} aria-hidden="true" />
                  <span>EventForm</span>
                </span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
