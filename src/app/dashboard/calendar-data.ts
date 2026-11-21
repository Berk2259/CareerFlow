export type TimelineEventLite = { application_id: string; created_at: string };
export type ApplicationLite = { id: string; created_at: string };

export function buildLastStatusDateMap(timeline: TimelineEventLite[]) {
  const map = new Map<string, string>();
  for (const event of timeline) {
    const existing = map.get(event.application_id);
    if (!existing || new Date(event.created_at) > new Date(existing)) {
      map.set(event.application_id, event.created_at);
    }
  }
  return map;
}

export function countForToday(apps: ApplicationLite[], timeline: TimelineEventLite[]) {
  const lastDateByApp = buildLastStatusDateMap(timeline);
  const today = new Date();

  return apps.filter((app) => {
    const date = new Date(lastDateByApp.get(app.id) ?? app.created_at);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }).length;
}