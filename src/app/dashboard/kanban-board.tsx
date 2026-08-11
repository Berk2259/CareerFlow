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
  { key: "basvuruldu", label: "Başvuruldu" },
  { key: "mulakat", label: "Mülakat" },
  { key: "teklif", label: "Teklif" },
  { key: "red", label: "Red" },
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
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  <h2 className="text-sm font-medium text-gray-900">
                    {column.label} ({columnApps.length})
                  </h2>

                  {columnApps.length === 0 && (
                    <p className="text-xs text-gray-400">Başvuru yok</p>
                  )}

                  {columnApps.map((app, index) => (
                    <Draggable draggableId={app.id} index={index} key={app.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="space-y-2 rounded-lg border border-gray-200 bg-white p-4"
                        >
                          <p className="text-sm font-medium text-gray-900">{app.position}</p>
                          <p className="text-xs text-gray-500">{app.company}</p>
                          {app.job_link && (
                            <a
                              href={app.job_link}
                              target="_blank"
                              className="block text-xs text-blue-600 hover:underline"
                            >
                              İlana git
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