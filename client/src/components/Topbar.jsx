export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>User</span>
        <span className="text-slate-300">&gt;</span>
        <span className="font-semibold text-slate-800">Event Form</span>
      </div>

      <div className="flex items-center gap-3">
     

        <span className="text-sm text-slate-500">
          Logged in as: <span className="font-semibold text-slate-800">User</span>
        </span>
      </div>
    </header>
  );
}
