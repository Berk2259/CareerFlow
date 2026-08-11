import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";
import { addApplication } from "./actions";
import KanbanBoard from "./kanban-board";

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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-slate-900">CareerFlow</span>
          <form action={signOut}>
            <button className="text-sm text-slate-500 transition hover:text-slate-900">
              Çıkış yap
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-8 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-slate-900">Yeni başvuru ekle</h2>
          <form action={addApplication} className="flex flex-col gap-3 sm:flex-row">
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
            <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              Ekle
            </button>
          </form>
        </div>

        <KanbanBoard applications={applications ?? []} />
      </div>
    </div>
  );
}