import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { countForToday } from "../calendar-data";
import Sidebar from "../sidebar";
import MonthlyStatsDonut from "./monthly-stats-donut";

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_LABELS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const STATUS_CARD_CLASSES: Record<string, string> = {
  basvuruldu: "bg-indigo-100 text-indigo-700",
  mulakat: "bg-violet-100 text-violet-700",
  teklif: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
};

function parseMonthParam(value: string | undefined) {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return { year, month: month - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

function monthParam(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: timelineEvents } = await supabase
    .from("application_timeline")
    .select("*")
    .order("created_at", { ascending: true });

  const apps = applications ?? [];
  const timeline = timelineEvents ?? [];
  const initial = user.email?.[0]?.toUpperCase() ?? "?";
  const todayCount = countForToday(apps, timeline);

  const { month: monthStr } = await searchParams;
  const { year, month } = parseMonthParam(monthStr);

  const lastEventDateByApp = new Map<string, string>();
  for (const event of timeline) {
    const existing = lastEventDateByApp.get(event.application_id);
    if (!existing || new Date(event.created_at) > new Date(existing)) {
      lastEventDateByApp.set(event.application_id, event.created_at);
    }
  }

  const itemsByDay = new Map<
    number,
    { company: string; position: string; status: string; stepLabel: string | null }[]
  >();
  const monthlyStatusCounts: Record<string, number> = {
    basvuruldu: 0,
    mulakat: 0,
    teklif: 0,
    red: 0,
  };

  for (const app of apps) {
    const lastDate = lastEventDateByApp.get(app.id) ?? app.created_at;
    const date = new Date(lastDate);
    if (date.getFullYear() !== year || date.getMonth() !== month) continue;

    const day = date.getDate();
    const list = itemsByDay.get(day) ?? [];
    list.push({
      company: app.company,
      position: app.position,
      status: app.status,
      stepLabel: app.current_step_label,
    });
    itemsByDay.set(day, list);

    if (app.status in monthlyStatusCounts) {
      monthlyStatusCounts[app.status] += 1;
    }
  }

  const monthlyStatItems = [
    { key: "basvuruldu", label: "Başvuruldu", color: "#6366f1" },
    { key: "mulakat", label: "Mülakat", color: "#8b5cf6" },
    { key: "teklif", label: "Teklif", color: "#10b981" },
    { key: "red", label: "Red", color: "#f87171" },
  ].map((s) => ({ ...s, count: monthlyStatusCounts[s.key] ?? 0 }));
  const monthlyTotal = monthlyStatItems.reduce((sum, s) => sum + s.count, 0);

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const prev = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  const next = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar initial={initial} active="calendar" todayCount={todayCount} />

      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <h1 className="mb-4 text-[22px] font-extrabold text-slate-900">Başvuru Takvimi</h1>

          <div className="mb-5">
            <MonthlyStatsDonut items={monthlyStatItems} total={monthlyTotal} />
          </div>

          <div className="mb-2 flex items-center gap-3.5">
            <Link
              href={`/dashboard/calendar?month=${monthParam(prev.year, prev.month)}`}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              ‹
            </Link>
            <h2 className="min-w-[150px] text-center text-lg font-extrabold text-slate-900">
              {MONTH_LABELS[month]} {year}
            </h2>
            <Link
              href={`/dashboard/calendar?month=${monthParam(next.year, next.month)}`}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              ›
            </Link>
          </div>

          <div className="mt-2 rounded-[20px] border border-slate-200 bg-white p-[22px] pb-[26px] shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
            <div className="mb-2 grid grid-cols-7">
              {WEEKDAYS.map((wd) => (
                <span
                  key={wd}
                  className="text-center text-[10.5px] font-extrabold uppercase text-slate-400"
                >
                  {wd}
                </span>
              ))}
            </div>
            <div className="grid auto-rows-[132px] grid-cols-7 gap-[9px]">
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} className="h-[132px] rounded-[13px] opacity-30" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const items = itemsByDay.get(day) ?? [];
                const isToday = isCurrentMonth && today.getDate() === day;
                return (
                  <div
                    key={day}
                    className={`flex h-[132px] flex-col gap-[5px] overflow-hidden rounded-[13px] border px-[9px] py-[8px] ${
                      isToday ? "border-amber-400 bg-amber-50" : "border-slate-100 bg-[#fcfdfe]"
                    }`}
                  >
                    <div className="text-[11.5px] font-extrabold text-slate-600">{day}</div>
                    {items.slice(0, 2).map((it, idx) => (
                      <div
                        key={idx}
                        className={`rounded-[9px] px-2 py-1.5 text-[10.5px] font-bold ${
                          STATUS_CARD_CLASSES[it.status] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="text-[11px] font-extrabold">{it.company}</div>
                        <div className="truncate text-[9.5px] opacity-85">
                          {it.position}
                          {it.stepLabel ? ` — ${it.stepLabel}` : ""}
                        </div>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-[9.5px] font-extrabold text-slate-400">
                        +{items.length - 2} daha
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}