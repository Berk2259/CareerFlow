"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { updateApplicationStatus } from "./actions";
import { STATUSES } from "./statuses";

type Application = {
    id: string;
    company: string;
    position: string;
    job_link: string | null;
    status: string;
};

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