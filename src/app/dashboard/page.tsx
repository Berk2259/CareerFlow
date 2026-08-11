import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";
import { addApplication } from "./actions";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <form action={signOut}>
            <button className="text-sm text-gray-500 hover:text-gray-800">Çıkış yap</button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-gray-900">Yeni başvuru ekle</h2>
          <form action={addApplication} className="flex flex-col gap-3 sm:flex-row">
            <input
              name="company"
              placeholder="Şirket"
              required
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <input
              name="position"
              placeholder="Pozisyon"
              required
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <input
              name="job_link"
              placeholder="İlan linki (opsiyonel)"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              Ekle
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-900">Başvurularım</h2>
          {applications && applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {app.position} — {app.company}
                  </p>
                  <p className="text-xs text-gray-500">{app.status}</p>
                </div>
                {app.job_link && (
                  <a
                    href={app.job_link}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    İlana git
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">Henüz başvuru eklemedin.</p>
          )}
        </div>
      </div>
    </div>
  );
}