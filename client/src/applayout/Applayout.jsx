import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function Applayout() {
  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
