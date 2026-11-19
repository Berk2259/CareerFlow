"use client";

import { useEffect, useState } from "react";
import { addTimelineEvent } from "./actions";
import { STATUSES } from "./statuses";

export type Application = {
    id: string;
    company: string;
    position: string;
    job_link: string | null;
    status: string;
    work_mode: string | null;
    employment_type: string | null;
    city: string | null;
    source: string | null;
    cv_type: string | null;
    note: string | null;
    interview_note: string | null;
    company_followers: string | null;
    company_employees: string | null;
    current_step_label: string | null;
    current_step_tag: string | null;
    created_at: string;
};

export type TimelineEvent = {
    id: string;
    application_id: string;
    step_key: string;
    title: string;
    meta: string | null;
    tag: string | null;
    round: number | null;
    created_at: string;
};

const WORK_MODE_LABELS: Record<string, string> = {
    remote: "Remote",
    hibrit: "Hibrit",
    ofis: "Ofis",
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
    staj: "Staj",
    tam_zamanli: "Tam Zamanlı",
    yari_zamanli: "Yarı Zamanlı",
    sozlesmeli: "Sözleşmeli",
};

const SOURCE_LABELS: Record<string, string> = {
    linkedin: "LinkedIn",
    kariyer_net: "Kariyer.net",
    indeed: "Indeed",
    kendi_sitesi: "Kendi sitesi",
};

const CV_TYPE_LABELS: Record<string, string> = {
    turkce: "Türkçe",
    ingilizce: "İngilizce",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ApplicationDetail({
    application,
    timeline,
    onClose,
}: {
    application: Application | null;
    timeline: TimelineEvent[];
    onClose: () => void;
}) {
    const [cached, setCached] = useState<Application | null>(application);
    const [cachedTimeline, setCachedTimeline] = useState<TimelineEvent[]>(timeline);

    useEffect(() => {
        if (application) setCached(application);
    }, [application]);

    useEffect(() => {
        if (application) setCachedTimeline(timeline);
    }, [application, timeline]);

    const open = application !== null;
    const app = cached;

    if (!app) return null;

    const currentStatusLabel = STATUSES.find((s) => s.key === app.status)?.label ?? app.status;

    const steps: { id?: string; step_key: string; title: string; meta: string | null; tag: string | null; round: number | null; created_at: string }[] = [
        { step_key: "basvuruldu", title: "Başvuruldu", meta: "Başvuru formu ve CV gönderildi", tag: null, round: null, created_at: app.created_at },
        ...cachedTimeline,
    ];
    const isFinal = app.status === "teklif" || app.status === "red";
    const last = steps[steps.length - 1];

    type NextAction = {
        label: string;
        icon: string;
        className: string;
        payload: Parameters<typeof addTimelineEvent>[1];
    };

    let nextQuestion = "";
    let nextActions: NextAction[] = [];

    if (last.step_key === "basvuruldu") {
        nextQuestion = "Sıradaki adım";
        nextActions = [
            {
                label: "İncelemeye al",
                icon: "📋",
                className: "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
                payload: { stepKey: "inceleniyor", title: "İnceleniyor", meta: "İK ekibi CV'yi değerlendiriyor", tag: "İK" },
            },
        ];
    } else if (last.step_key === "inceleniyor") {
        nextQuestion = "Sıradaki adım";
        nextActions = [
            {
                label: "Ön görüşmeye al",
                icon: "📞",
                className: "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
                payload: { stepKey: "on_gorusme", title: "Ön görüşme", meta: "Telefonla kısa tanışma görüşmesi", tag: "İK" },
            },
        ];
    } else if (last.step_key === "on_gorusme") {
        nextQuestion = "Ön görüşme sonucu ne oldu?";
        nextActions = [
            {
                label: "Mülakata geçti",
                icon: "➜",
                className: "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
                payload: { stepKey: "mulakat", title: "Teknik mülakat · Tur 1", meta: "Görüşme planlandı ve tamamlandı", tag: "Teknik", round: 1 },
            },
            {
                label: "Burada red oldu",
                icon: "✕",
                className: "hover:border-red-300 hover:bg-red-50 hover:text-red-700",
                payload: { stepKey: "red", title: "Red edildi", meta: "Ön görüşme sonrası süreç sonlandı.", finalStatus: "red" },
            },
        ];
    } else if (last.step_key === "mulakat") {
        const nextKind = last.tag === "Teknik" ? "Yönetici" : "Teknik";
        const nextRound = (last.round ?? 1) + 1;
        nextQuestion = "Bu turdan sonra ne oldu?";
        nextActions = [
            {
                label: "Yeni tura geçti",
                icon: "➜",
                className: "hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700",
                payload: { stepKey: "mulakat", title: `${nextKind} mülakat · Tur ${nextRound}`, meta: "Görüşme planlandı ve tamamlandı", tag: nextKind, round: nextRound },
            },
            {
                label: "Beklemeye alındı",
                icon: "⏳",
                className: "hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700",
                payload: { stepKey: "beklemede", title: "Beklemede", meta: "Son mülakat sonrası dönüş takip ediliyor" },
            },
            {
                label: "Teklif aldı",
                icon: "🏆",
                className: "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                payload: { stepKey: "teklif", title: "Teklif alındı", finalStatus: "teklif" },
            },
            {
                label: "Red oldu",
                icon: "✕",
                className: "hover:border-red-300 hover:bg-red-50 hover:text-red-700",
                payload: { stepKey: "red", title: "Red edildi", finalStatus: "red" },
            },
        ];
    } else if (last.step_key === "beklemede") {
        nextQuestion = "Sonuç ne oldu?";
        nextActions = [
            {
                label: "Teklif aldı",
                icon: "🏆",
                className: "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                payload: { stepKey: "teklif", title: "Teklif alındı", finalStatus: "teklif" },
            },
            {
                label: "Red oldu",
                icon: "✕",
                className: "hover:border-red-300 hover:bg-red-50 hover:text-red-700",
                payload: { stepKey: "red", title: "Red edildi", finalStatus: "red" },
            },
        ];
    }

    function formatTime(iso: string) {
        return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={onClose}
            />
            <aside
                className={`fixed right-0 top-0 bottom-0 z-50 flex w-[460px] max-w-[92vw] flex-col bg-slate-50 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
                    <span className="text-sm font-bold">Başvuru Detayı</span>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 pb-16">
                    <div className="mb-4 rounded-2xl border border-slate-200 border-l-4 border-l-indigo-600 bg-white p-5 shadow-sm">
                        <div className="mb-3.5 flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 text-sm font-extrabold text-white">
                                    {app.company.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-[15.5px] font-extrabold leading-snug text-slate-900">
                                        {app.position}
                                    </h1>
                                    <div className="text-xs font-semibold text-slate-500">
                                        {app.company}
                                        {app.city ? ` · ${app.city}` : ""}
                                    </div>
                                </div>
                            </div>
                            <span className="whitespace-nowrap rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700">
                                {currentStatusLabel}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {app.source && (
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                                    {SOURCE_LABELS[app.source] ?? app.source}
                                </span>
                            )}
                            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                                {formatDate(app.created_at)}
                            </span>
                            {app.work_mode && (
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                                    {WORK_MODE_LABELS[app.work_mode] ?? app.work_mode}
                                </span>
                            )}
                            {app.employment_type && (
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                                    {EMPLOYMENT_TYPE_LABELS[app.employment_type] ?? app.employment_type}
                                </span>
                            )}
                            {app.cv_type && (
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-bold text-slate-600">
                                    {CV_TYPE_LABELS[app.cv_type] ?? app.cv_type} CV
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
                        <h3 className="mb-4 text-[13px] font-bold text-slate-900">Durum güncelle</h3>

                        <div className="flex flex-col">
                            {steps.map((s, i) => {
                                const isLast = i === steps.length - 1;
                                const done = !isLast || isFinal;
                                const isRejectFinal = s.step_key === "red" && isLast && isFinal;
                                const nodeIcon =
                                    s.step_key === "teklif" ? "🏆" :
                                        s.step_key === "red" ? "✕" :
                                            s.step_key === "beklemede" ? "⏳" :
                                                done ? "✓" : String(i + 1);

                                return (
                                    <div key={s.id ?? `${s.step_key}-${i}`} className="flex gap-3.5">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold ${isRejectFinal
                                                        ? "border-2 border-red-500 bg-white text-red-500"
                                                        : done
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-slate-900 text-white"
                                                    }`}
                                            >
                                                {nodeIcon}
                                            </div>
                                            {!isLast && (
                                                <div className={`my-0.5 w-0.5 flex-1 min-h-[22px] ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                                            )}
                                        </div>
                                        <div className={`flex-1 ${isLast ? "pb-1" : "pb-5"}`}>
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span
                                                    className={`text-[13px] font-bold ${isRejectFinal ? "text-red-600" : done ? "text-emerald-700" : "text-slate-900"
                                                        }`}
                                                >
                                                    {s.title}
                                                </span>
                                                <span className="flex-shrink-0 text-[10px] font-semibold text-slate-300">
                                                    {formatTime(s.created_at)}
                                                </span>
                                            </div>
                                            {s.meta && <p className="mt-0.5 text-[11px] text-slate-400">{s.meta}</p>}
                                            {s.tag && (
                                                <span className="mt-1.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
                                                    {s.tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!isFinal && nextActions.length > 0 && (
                            <div className="mt-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
                                <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                                    {nextQuestion}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {nextActions.map((a) => (
                                        <button
                                            key={a.label}
                                            onClick={() => addTimelineEvent(app.id, a.payload)}
                                            className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-[11px] font-bold text-slate-600 transition ${a.className}`}
                                        >
                                            <span className="text-[14px]">{a.icon}</span>
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="mb-3 text-[13px] font-bold text-slate-900">Notlar</h3>
                        <span className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-wide text-indigo-600">
                            Genel not
                        </span>
                        <div
                            className={`rounded-xl border p-3 text-[13px] leading-relaxed ${app.note
                                    ? "border-indigo-100 bg-indigo-50/50 text-slate-700"
                                    : "border-slate-100 bg-slate-50 italic text-slate-400"
                                }`}
                        >
                            {app.note ?? "Not eklenmemiş."}
                        </div>
                        <span className="mb-1.5 mt-3 block text-[10.5px] font-bold uppercase tracking-wide text-indigo-600">
                            Mülakat notu
                        </span>
                        <div
                            className={`rounded-xl border p-3 text-[13px] leading-relaxed ${app.interview_note
                                    ? "border-indigo-100 bg-indigo-50/50 text-slate-700"
                                    : "border-slate-100 bg-slate-50 italic text-slate-400"
                                }`}
                        >
                            {app.interview_note ?? "Henüz mülakat yapılmadı."}
                        </div>
                    </div>

                    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="mb-3 text-[13px] font-bold text-slate-900">Başvuru Bilgileri</h3>
                        <div className="grid grid-cols-2 gap-3.5">
                            <div>
                                <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Şehir</div>
                                <div className="text-[13px] font-semibold text-slate-800">{app.city ?? "—"}</div>
                            </div>
                            <div>
                                <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Başvuru Tarihi</div>
                                <div className="text-[13px] font-semibold text-slate-800">{formatDate(app.created_at)}</div>
                            </div>
                            <div>
                                <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Başvuru Yeri</div>
                                <div className="text-[13px] font-semibold text-slate-800">
                                    {app.source ? SOURCE_LABELS[app.source] ?? app.source : "—"}
                                </div>
                            </div>
                            <div>
                                <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">CV Türü</div>
                                <div className="text-[13px] font-semibold text-slate-800">
                                    {app.cv_type ? CV_TYPE_LABELS[app.cv_type] ?? app.cv_type : "—"}
                                </div>
                            </div>
                        </div>
                        {app.job_link && (
                            <a
                                href={app.job_link}
                                target="_blank"
                                className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-bold text-indigo-600 hover:underline"
                            >
                                İlana git →
                            </a>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="mb-3 text-[13px] font-bold text-slate-900">Şirket Bilgisi</h3>
                        <div className="flex gap-2.5">
                            <div className="flex-1 rounded-xl bg-slate-50 p-3 text-center">
                                <div className="text-[17px] font-extrabold text-slate-900">{app.company_followers ?? "—"}</div>
                                <div className="mt-0.5 text-[10.5px] font-semibold text-slate-500">Takipçi</div>
                            </div>
                            <div className="flex-1 rounded-xl bg-slate-50 p-3 text-center">
                                <div className="text-[17px] font-extrabold text-slate-900">{app.company_employees ?? "—"}</div>
                                <div className="mt-0.5 text-[10.5px] font-semibold text-slate-500">Çalışan</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}