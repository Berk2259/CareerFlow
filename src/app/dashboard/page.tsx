import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addApplication } from "./actions";
import { countForToday } from "./calendar-data";
import KanbanBoard from "./kanban-board";
import Sidebar from "./sidebar";
import { STATUSES } from "./statuses";;

export default async function DashboardPage() {
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar initial={initial} todayCount={todayCount} />

      <div
        className="flex-1"
        style={{
          backgroundImage: "url('/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-slate-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-8 pt-8 pb-16">
            <h1 className="text-2xl font-bold text-white">Merhaba 👋</h1>
            <p className="mt-1 text-sm text-slate-300">Başvurularının genel durumu aşağıda.</p>
          </div>
        </div>

        <div className="relative mx-auto -mt-8 max-w-6xl space-y-8 px-8 pb-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATUSES.map((status) => {
            const count = apps.filter((app) => app.status === status.key).length;
            const Icon = status.icon;

            return (
              <div
                key={status.key}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${status.iconBg}`}>
                    <Icon className={`h-4 w-4 ${status.iconColor}`} />
                  </div>
                  <p className="text-xs font-medium text-slate-500">{status.label}</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{count}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-slate-900">Yeni başvuru ekle</h2>
          <form action={addApplication} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <input
              name="company"
              placeholder="Şirket"
              required
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <input
              name="position"
              placeholder="Pozisyon"
              required
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <input
              name="job_link"
              placeholder="İlan linki (opsiyonel)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <select
              name="employment_type"
              defaultValue=""
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">Pozisyon tipi (opsiyonel)</option>
              <option value="staj">Staj</option>
              <option value="tam_zamanli">Tam Zamanlı</option>
              <option value="yari_zamanli">Yarı Zamanlı</option>
              <option value="sozlesmeli">Sözleşmeli</option>
            </select>
            <select
              name="work_mode"
              defaultValue=""
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">Çalışma şekli (opsiyonel)</option>
              <option value="remote">Remote</option>
              <option value="hibrit">Hibrit</option>
              <option value="ofis">Ofis</option>
            </select>
            <input
              name="city"
              placeholder="Şehir (opsiyonel)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <select
              name="source"
              defaultValue=""
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">Başvuru yeri (opsiyonel)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="kariyer_net">Kariyer.net</option>
              <option value="indeed">Indeed</option>
              <option value="kendi_sitesi">Kendi sitesi</option>
            </select>
            <select
              name="cv_type"
              defaultValue=""
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">CV türü (opsiyonel)</option>
              <option value="turkce">Türkçe</option>
              <option value="ingilizce">İngilizce</option>
            </select>
            <input
              name="applied_date"
              type="date"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <input
              name="company_followers"
              placeholder="Takipçi sayısı (opsiyonel)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <input
              name="company_employees"
              placeholder="Çalışan sayısı (opsiyonel)"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              Ekle
            </button>
          </form>
        </div>

          <KanbanBoard applications={apps} timeline={timeline} />
        </div>
      </div>
    </div>
  );
}