"use client";

import { MoreHorizontal, CalendarClock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTasksStore, TASK_STATUSES, taskService, type Task, type TaskPriority } from "@/services/tasks/taskService";

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  low: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]",
};

function isPastDue(dueDate: string): boolean {
  return new Date(dueDate).getTime() < Date.now();
}

function TaskCard({ task }: { task: Task }) {
  const isOverdue = isPastDue(task.dueDate) && task.status !== "completed";

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-4 transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{task.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Move task"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-opacity flex-shrink-0 focus-ring"
          >
            <MoreHorizontal size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-40">
            {TASK_STATUSES.filter((s) => s.value !== task.status).map((s) => (
              <DropdownMenuItem key={s.value} onClick={() => taskService.moveStatus(task.id, s.value)}>
                Move to {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn("text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border", PRIORITY_STYLES[task.priority])}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <User size={12} /> {task.assignee}
        </span>
        <span className={cn("flex items-center gap-1.5", isOverdue && "text-rose-400")}>
          <CalendarClock size={12} />
          {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}

export default function TasksBoardPage() {
  useTasksStore((s) => s.tasks);
  const grouped = taskService.listByStatus();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Tasks</h1>
        <p className="text-sm text-[var(--text-muted)]">Keep your day organized across every deal in motion.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {TASK_STATUSES.map(({ value, label }) => {
          const tasks = grouped[value];
          return (
            <div key={value}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">{label}</h2>
                <span className="text-xs text-[var(--text-faint)] bg-[var(--surface)] px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </div>
              <div className="space-y-3 min-h-24">
                {tasks.length === 0 ? (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center">
                    <p className="text-xs text-[var(--text-faint)]">Nothing here</p>
                  </div>
                ) : (
                  tasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
