export type CalendarEventType = "inspection" | "meeting" | "follow_up" | "reminder";

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // "HH:mm"
  relatedTo: string;
}

export const EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  inspection: "Inspection",
  meeting: "Meeting",
  follow_up: "Follow-up",
  reminder: "Reminder",
};

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function dayOffset(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

/** SIMULATED calendar data — mock only this phase; UI is calendar-display only, no scheduling backend yet. */
const MOCK_EVENTS: CalendarEvent[] = [
  { id: "evt-01", title: "Inspection — East Legon Apartment", type: "inspection", date: dayOffset(0), time: "10:00", relatedTo: "Ama Serwaa" },
  { id: "evt-02", title: "Follow-up call", type: "follow_up", date: dayOffset(0), time: "15:30", relatedTo: "Kwabena Owusu" },
  { id: "evt-03", title: "Inspection — Cantonments House", type: "inspection", date: dayOffset(1), time: "11:00", relatedTo: "Efua Mensah" },
  { id: "evt-04", title: "Client meeting", type: "meeting", date: dayOffset(2), time: "09:00", relatedTo: "Kofi Ansah" },
  { id: "evt-05", title: "Lease renewal reminder", type: "reminder", date: dayOffset(3), time: "08:00", relatedTo: "Akosua Frimpong" },
  { id: "evt-06", title: "Inspection — Spintex Unit", type: "inspection", date: dayOffset(4), time: "14:00", relatedTo: "Abena Konadu" },
  { id: "evt-07", title: "Negotiation call", type: "meeting", date: dayOffset(4), time: "16:00", relatedTo: "Adjoa Boateng" },
  { id: "evt-08", title: "Follow-up email check", type: "follow_up", date: dayOffset(-2), time: "13:00", relatedTo: "Yaw Darko" },
  { id: "evt-09", title: "Document reminder", type: "reminder", date: dayOffset(-1), time: "09:30", relatedTo: "Kojo Appiah" },
  { id: "evt-10", title: "Inspection — Airport Residential", type: "inspection", date: dayOffset(6), time: "12:00", relatedTo: "Kofi Ansah" },
];

export interface CalendarService {
  list: () => CalendarEvent[];
  listByDate: (isoDay: string) => CalendarEvent[];
  listUpcoming: (limit?: number) => CalendarEvent[];
}

export const calendarService: CalendarService = {
  list: () => MOCK_EVENTS,
  listByDate: (isoDay) => MOCK_EVENTS.filter((e) => e.date === isoDay),
  listUpcoming: (limit = 5) =>
    MOCK_EVENTS.filter((e) => e.date >= isoDate(new Date()))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, limit),
};
