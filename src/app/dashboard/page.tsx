import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <form action={signOut}>
            <button className="text-sm text-gray-500 hover:text-gray-800">Çıkış yap</button>
          </form>
        </div>
        <p className="text-sm text-gray-600">
          Giriş yaptın: <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-sm text-gray-400">Başvuru takip tablosu buraya gelecek (Faz 1).</p>
      </div>
    </div>
  );
}