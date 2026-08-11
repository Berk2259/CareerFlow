import { signIn, signUp } from "./actions";
import { CheckCircle2, Calendar, LayoutGrid } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen">
      {/* Sol taraf: tanıtım paneli */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-slate-900 p-12 lg:flex">
        <div className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-slate-700/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-slate-600/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-md space-y-14">
          <span className="text-lg font-semibold text-white">CareerFlow</span>

          <div className="space-y-5">
            <h2 className="text-3xl font-bold leading-tight text-white">
              İş başvurularını tek yerden yönet.
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Başvurularını takip et, mülakat sürecini yönet, hiçbir fırsatı kaçırma.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <LayoutGrid className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-slate-200">Kanban görünümüyle süreci takip et</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-slate-200">Mülakat tarihlerini asla kaçırma</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-slate-200">Tüm başvurularını tek panelde gör</span>
            </div>
          </div>

          <div className="relative rotate-2 rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-400">Başvuruldu</p>
                <div className="rounded-md bg-white/10 p-2">
                  <div className="h-1.5 w-3/4 rounded bg-slate-300/40" />
                </div>
                <div className="rounded-md bg-white/10 p-2">
                  <div className="h-1.5 w-1/2 rounded bg-slate-300/40" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-400">Mülakat</p>
                <div className="rounded-md bg-indigo-500/20 p-2">
                  <div className="h-1.5 w-2/3 rounded bg-indigo-300/50" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-slate-400">Teklif</p>
                <div className="rounded-md bg-emerald-500/20 p-2">
                  <div className="h-1.5 w-3/5 rounded bg-emerald-300/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf: giriş formu */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-4 lg:w-1/2">
        <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900">Giriş yap</h1>
            <p className="text-sm leading-relaxed text-slate-500">
              Başvurularını takip etmek için hesabına giriş yap.
            </p>
          </div>

          {params.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{params.error}</p>
          )}
          {params.message && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{params.message}</p>
          )}

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="flex gap-2 pt-3">
              <button
                formAction={signIn}
                className="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Giriş yap
              </button>
              <button
                formAction={signUp}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Kayıt ol
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}