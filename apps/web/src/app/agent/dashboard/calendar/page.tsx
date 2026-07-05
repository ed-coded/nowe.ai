"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { calendarService, EVENT_TYPE_LABEL, type CalendarEventType } from "@/services/calendar/calendarService";

const TYPE_DOT: Record<CalendarEventType, string> = {
  inspection: "bg-[var(--accent)]",
  meeting: "bg-emerald-400",
  follow_up: "bg-amber-400",
  reminder: "bg-rose-400",
};

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState(() => isoDate(new Date()));

  const upcoming = calendarService.listUpcoming(6);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { date: Date | null; iso: string | null }[] = [];
    for (let i = 0; i < startOffset; i++) cells.push({ date: null, iso: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, iso: isoDate(date) });
    }
    return cells;
  }, [cursor]);

  const todayIso = isoDate(new Date());
  const selectedEvents = calendarService.listByDate(selectedDay);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Calendar</h1>
        <p className="text-sm text-[var(--text-muted)]">Inspections, meetings, follow-ups, and reminders.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                aria-label="Previous month"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                aria-label="Next month"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] font-semibold uppercase text-[var(--text-faint)] py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {days.map((cell, i) => {
              if (!cell.date || !cell.iso) return <div key={`empty-${i}`} />;
              const dayEvents = calendarService.listByDate(cell.iso);
              const isToday = cell.iso === todayIso;
              const isSelected = cell.iso === selectedDay;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelectedDay(cell.iso!)}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-xs transition-colors focus-ring",
                    isSelected
                      ? "bg-[var(--accent)] text-white"
                      : isToday
                        ? "bg-[var(--surface)] text-[var(--accent)] font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                  )}
                >
                  {cell.date.getDate()}
                  {dayEvents.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span key={e.id} className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : TYPE_DOT[e.type])} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              {new Date(selectedDay).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
            </h2>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-[var(--text-faint)]">No events this day.</p>
            ) : (
              <div className="space-y-2.5">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", TYPE_DOT[event.type])} />
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{event.title}</p>
                      <p className="text-xs text-[var(--text-faint)]">
                        {event.time} · {EVENT_TYPE_LABEL[event.type]} · {event.relatedTo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div key={event.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                    <CalendarClock size={13} className="text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--text-primary)] truncate">{event.title}</p>
                    <p className="text-[11px] text-[var(--text-faint)]">
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
