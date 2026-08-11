"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { updateApplicationStatus } from "./actions";

type Application = {
    id: string;
    company: string;
    position: string;
    job_link: string | null;
    status: string;
};

const STATUSES = [
    { key: "basvuruldu", label: "Başvuruldu", dot: "bg-slate-400", accent: "border-l-slate-400" },
    { key: "mulakat", label: "Mülakat", dot: "bg-indigo-500", accent: "border-l-indigo-500" },
    { key: "teklif", label: "Teklif", dot: "bg-emerald-500", accent: "border-l-emerald-500" },
    { key: "red", label: "Red", dot: "bg-red-400", accent: "border-l-red-400" },
];

export default function KanbanBoard({ applications }: { applications: Application[] }) {
    const [items, setItems] = useState(applications);

    function onDragEnd(result: DropResult) {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId;

        setItems((prev) =>
            prev.map((app) => (app.id === draggableId ? { ...app, status: newStatus } : app))
        );

        updateApplicationStatus(draggableId, newStatus);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATUSES.map((column) => {
                    const columnApps = items.filter((app) => app.status === column.key);

                    return (
                        <Droppable droppableId={column.key} key={column.key}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[120px] space-y-3 rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? "bg-slate-100" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        <span className={`h-2 w-2 rounded-full ${column.dot}`} />
                                        <h2 className="text-sm font-semibold text-slate-900">{column.label}</h2>
                                        <span className="text-xs text-slate-400">({columnApps.length})</span>
                                    </div>

                                    {columnApps.length === 0 && (
                                        <p className="px-1 text-xs text-slate-400">Başvuru yok</p>
                                    )}

                                    {columnApps.map((app, index) => (
                                        <Draggable draggableId={app.id} index={index} key={app.id}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`space-y-2 rounded-lg border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition ${column.accent} ${snapshot.isDragging ? "shadow-lg ring-2 ring-slate-900/10" : "hover:shadow-md"
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium text-slate-900">{app.position}</p>
                                                    <p className="text-xs text-slate-500">{app.company}</p>
                                                    {app.job_link && (
                                                        <a
                                                            href={app.job_link}
                                                            target="_blank"
                                                            className="inline-block text-xs font-medium text-indigo-600 hover:underline"
                                                        >
                                                            İlana git →
                                                        </a>
                                                    )}
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
    );
}