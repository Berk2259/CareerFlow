import Link from "next/link";
import { signOut } from "../login/actions";

const activeClasses =
  "bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-inset ring-white/10";
const inactiveClasses = "text-white/55 transition hover:translate-x-[3px] hover:text-white";

export default function Sidebar({
  initial,
  active = "dashboard",
  todayCount = 0,
}: {
  initial: string;
  active?: "dashboard" | "calendar";
  todayCount?: number;
}) {
  return (
    <aside className="relative flex w-60 flex-shrink-0 flex-col overflow-hidden bg-slate-900 px-4 py-6">
      <div className="sidebar-glow pointer-events-none absolute -top-20 -left-16 h-56 w-56 rounded-full bg-indigo-500/35 blur-2xl" />

      <div className="relative z-10 mb-8 flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-7 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-300" />
          <span className="text-[15px] font-extrabold text-white">CareerFlow</span>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
          {initial}
        </div>
      </div>

      <p className="relative z-10 mb-2 px-2.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white/30">
        Genel
      </p>
      <Link
        href="/dashboard"
        className={`relative z-10 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-bold ${
          active === "dashboard" ? activeClasses : inactiveClasses
        }`}
      >
        <span
          className={`w-4 text-center text-sm ${
            active === "dashboard"
              ? "icon-wiggle [filter:drop-shadow(0_0_6px_rgba(165,180,252,0.8))]"
              : ""
          }`}
        >
          📋
        </span>
        Dashboard
      </Link>
      <Link
        href="/dashboard/calendar"
        className={`relative z-10 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-bold ${
          active === "calendar" ? activeClasses : inactiveClasses
        }`}
      >
        <span
          className={`w-4 text-center text-sm ${
            active === "calendar"
              ? "icon-wiggle [filter:drop-shadow(0_0_6px_rgba(165,180,252,0.8))]"
              : ""
          }`}
        >
          📅
        </span>
        Takvim
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-extrabold text-white/70">
          {todayCount}
        </span>
      </Link>

      <p className="relative z-10 mt-5 mb-2 px-2.5 text-[9.5px] font-extrabold uppercase tracking-wide text-white/30">
        Hesap
      </p>
      <div className="relative z-10 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-bold text-white/55 transition hover:translate-x-[3px] hover:text-white">
        <span className="w-4 text-center text-sm">⚙️</span>
        Ayarlar
      </div>
      <form action={signOut} className="relative z-10">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-bold text-white/55 transition hover:translate-x-[3px] hover:text-white">
          <span className="w-4 text-center text-sm">🚪</span>
          Çıkış yap
        </button>
      </form>
    </aside>
  );
}