"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { updateApplicationStatus, addTimelineEvent } from "./actions";
import { STATUSES } from "./statuses";
import ApplicationDetail, { type Application, type TimelineEvent } from "./application-detail";

const WORK_MODE_LABELS: Record<string, string> = {
    remote: "Remote",
    hibrit: "Hibrit",
    ofis: "Ofis",
};

const WORK_MODE_SHORT: Record<string, string> = {
    remote: "RM",
    hibrit: "HB",
    ofis: "OF",
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
    staj: "Staj",
    tam_zamanli: "Tam Zamanlı",
    yari_zamanli: "Yarı Zamanlı",
    sozlesmeli: "Sözleşmeli",
};

const EMPLOYMENT_TYPE_SHORT: Record<string, string> = {
    staj: "ST",
    tam_zamanli: "TZ",
    yari_zamanli: "YZ",
    sozlesmeli: "SZ",
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

function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Bugün";
    if (days === 1) return "1 gün önce";
    return `${days} gün önce`;
}

export default function KanbanBoard({
    applications,
    timeline,
}: {
    applications: Application[];
    timeline: TimelineEvent[];
}) {
    const [items, setItems] = useState(applications);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedApp = items.find((app) => app.id === selectedId) ?? null;
    const selectedTimeline = timeline.filter((t) => t.application_id === selectedId);

    useEffect(() => {
        setItems(applications);
    }, [applications]);

    function onDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId;

        setItems((prev) =>
            prev.map((app) => (app.id === draggableId ? { ...app, status: newStatus } : app))
        );

        if (newStatus === "teklif") {
            addTimelineEvent(draggableId, { stepKey: "teklif", title: "Teklif alındı", finalStatus: "teklif" });
        } else if (newStatus === "red") {
            addTimelineEvent(draggableId, { stepKey: "red", title: "Red edildi", finalStatus: "red" });
        } else if (newStatus === "mulakat") {
            addTimelineEvent(draggableId, {
                stepKey: "mulakat",
                title: "Mülakata alındı",
                meta: "Sürükle-bırak ile taşındı",
            });
        } else if (newStatus === "basvuruldu") {
            addTimelineEvent(draggableId, {
                stepKey: "basvuruldu",
                title: "Başvuruya geri alındı",
                meta: "Sürükle-bırak ile geri taşındı",
                finalStatus: "basvuruldu",
            });
        } else {
            updateApplicationStatus(draggableId, newStatus);
        }
    }

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STATUSES.map((column) => {
                        const columnApps = items.filter((app) => app.status === column.key);
                        const Icon = column.icon;

                        return (
                            <Droppable droppableId={column.key} key={column.key}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex min-h-[320px] flex-col gap-3 rounded-xl border border-slate-200 p-3 transition-colors ${snapshot.isDraggingOver ? "bg-slate-100" : "bg-slate-50/70"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 px-1">
                                            <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                                            <h2 className="text-sm font-semibold text-slate-900">{column.label}</h2>
                                            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                                                {columnApps.length}
                                            </span>
                                        </div>

                                        {columnApps.length === 0 && (
                                            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-8">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${column.iconBg}`}>
                                                    <Icon className={`h-4 w-4 ${column.iconColor}`} />
                                                </div>
                                                <p className="text-center text-xs text-slate-400">Başvuru yok</p>
                                            </div>
                                        )}

                                        {columnApps.map((app, index) => (
                                            <Draggable draggableId={app.id} index={index} key={app.id}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`group relative min-h-[150px] cursor-pointer overflow-hidden rounded-lg border border-l-4 border-slate-200 bg-white shadow-sm transition ${column.accent} ${snapshot.isDragging ? "shadow-lg ring-2 ring-slate-900/10" : "hover:shadow-md"
                                                            }`}
                                                        onClick={() => setSelectedId(app.id)}
                                                    >
                                                        <div className="app-card-main space-y-2 p-4 pr-11">
                                                            <p className="text-sm font-bold text-slate-900">{app.position}</p>
                                                            <p className="text-xs font-semibold text-slate-600">{app.company}</p>

                                                            {app.status === "mulakat" && app.current_step_label && (
                                                                <span
                                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9.5px] font-extrabold ${app.current_step_label === "Beklemede"
                                                                        ? "bg-amber-100 text-amber-700"
                                                                        : app.current_step_tag === "Teknik"
                                                                            ? "bg-blue-100 text-blue-700"
                                                                            : app.current_step_tag === "Yönetici"
                                                                                ? "bg-orange-100 text-orange-700"
                                                                                : "bg-violet-100 text-violet-700"
                                                                        }`}
                                                                >
                                                                    <span
                                                                        className={`h-1.5 w-1.5 rounded-full ${app.current_step_label === "Beklemede" ? "animate-pulse bg-amber-500" : "bg-current"
                                                                            }`}
                                                                    />
                                                                    {app.current_step_label}
                                                                </span>
                                                            )}
                                                            {app.status === "basvuruldu" && (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2 py-1 text-[9.5px] font-extrabold text-indigo-700">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                    {app.current_step_label ?? "Başvuruldu"}
                                                                </span>
                                                            )}
                                                            {app.status === "teklif" && (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-[9.5px] font-extrabold text-emerald-700">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                    {app.current_step_label ?? "Teklif alındı"}
                                                                </span>
                                                            )}
                                                            {app.status === "red" && (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-[9.5px] font-extrabold text-red-700">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                    {app.current_step_label ?? "Red edildi"}
                                                                </span>
                                                            )}

                                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                                                                {app.job_link ? (
                                                                    <a
                                                                        href={app.job_link}
                                                                        target="_blank"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="text-xs font-bold text-indigo-600 hover:underline"
                                                                    >
                                                                        İlana git →
                                                                    </a>
                                                                ) : (
                                                                    <span />
                                                                )}
                                                                <span className="text-[10.5px] font-semibold text-slate-400">
                                                                    {timeAgo(app.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="app-card-dock absolute inset-y-0 right-0 flex w-9 flex-col items-center justify-center gap-1.5 border-l border-slate-100 bg-slate-50">
                                                            {app.source === "linkedin" && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700">
                                                                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.6V9h3.5v11.4z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {app.cv_type && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-[8px] font-extrabold text-emerald-700">
                                                                    {app.cv_type === "ingilizce" ? "EN" : "TR"}
                                                                </div>
                                                            )}
                                                            {app.work_mode && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-[8px] font-extrabold text-cyan-700">
                                                                    {WORK_MODE_SHORT[app.work_mode] ?? "?"}
                                                                </div>
                                                            )}
                                                            {app.employment_type && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-[8px] font-extrabold text-orange-700">
                                                                    {EMPLOYMENT_TYPE_SHORT[app.employment_type] ?? "?"}
                                                                </div>
                                                            )}
                                                            {app.city && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                                                                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M12 21C12 21 19 14.5 19 9A7 7 0 0 0 5 9C5 14.5 12 21 12 21Z" />
                                                                        <circle cx="12" cy="9" r="2.3" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {app.note && (
                                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-purple-200 bg-purple-50 text-purple-700">
                                                                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="app-card-overlay absolute inset-0 bg-white p-4">
                                                            <div className="ov-page ov-page-1 flex flex-col justify-start gap-2.5">
                                                                <div className="ov-row flex items-center gap-2.5">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-700">
                                                                        {app.source === "linkedin" ? (
                                                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.1zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.6V9h3.5v11.4z" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                                <path d="M10 13A5 5 0 0 0 17 13L21 9A5 5 0 0 0 14 2L12.5 3.5" />
                                                                                <path d="M14 11A5 5 0 0 0 7 11L3 15A5 5 0 0 0 10 22L11.5 20.5" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs font-semibold text-slate-700">
                                                                        <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Başvuru Yeri</span>
                                                                        {app.source ? SOURCE_LABELS[app.source] ?? app.source : "—"}
                                                                    </div>
                                                                </div>

                                                                <div className="ov-row flex items-center gap-2.5">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-[9px] font-extrabold text-emerald-700">
                                                                        {app.cv_type === "ingilizce" ? "EN" : app.cv_type === "turkce" ? "TR" : "—"}
                                                                    </div>
                                                                    <div className="text-xs font-semibold text-slate-700">
                                                                        <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">CV Türü</span>
                                                                        {app.cv_type ? CV_TYPE_LABELS[app.cv_type] ?? app.cv_type : "—"}
                                                                    </div>
                                                                </div>

                                                                <div className="ov-row flex items-center gap-2.5">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-cyan-700">
                                                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <circle cx="12" cy="12" r="9" />
                                                                            <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="text-xs font-semibold text-slate-700">
                                                                        <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Çalışma Şekli</span>
                                                                        {app.work_mode ? WORK_MODE_LABELS[app.work_mode] ?? app.work_mode : "—"}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="ov-page ov-page-2 flex flex-col justify-start gap-2.5">
                                                                <div className="ov-row flex items-center gap-2.5">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-orange-700">
                                                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <rect x="3" y="7" width="18" height="13" rx="2" />
                                                                            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="text-xs font-semibold text-slate-700">
                                                                        <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Pozisyon Tipi</span>
                                                                        {app.employment_type ? EMPLOYMENT_TYPE_LABELS[app.employment_type] ?? app.employment_type : "—"}
                                                                    </div>
                                                                </div>

                                                                {app.note && (
                                                                    <div className="ov-row flex items-center gap-2.5">
                                                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-purple-200 bg-purple-50 text-purple-700">
                                                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="text-xs font-semibold text-slate-700">
                                                                            <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Genel Not</span>
                                                                            {app.note.length > 40 ? app.note.slice(0, 40) + "…" : app.note}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="ov-row flex items-center gap-2.5">
                                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                                                                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M12 21C12 21 19 14.5 19 9A7 7 0 0 0 5 9C5 14.5 12 21 12 21Z" />
                                                                            <circle cx="12" cy="9" r="2.3" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="text-xs font-semibold text-slate-700">
                                                                        <span className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-wide text-slate-400">Şirket</span>
                                                                        {app.city ?? "—"}
                                                                        {app.company_followers ? ` · ${app.company_followers} takipçi` : ""}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
                                                                <span className="ov-dot ov-dot-1" />
                                                                <span className="ov-dot ov-dot-2" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
            <ApplicationDetail application={selectedApp} timeline={selectedTimeline} onClose={() => setSelectedId(null)} />
        </>
    );
}