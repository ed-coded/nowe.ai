import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  status: TaskStatus;
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const now = Date.now();
const daysFromNow = (n: number) => new Date(now + n * 86400000).toISOString();

/** SIMULATED task board data — mock only this phase; no real `tasks` table exists yet. */
const MOCK_TASKS: Task[] = [
  { id: "task-01", title: "Call Ama Serwaa about inspection time", priority: "high", dueDate: daysFromNow(0), assignee: "You", status: "todo" },
  { id: "task-02", title: "Prepare listing photos for East Legon unit", priority: "medium", dueDate: daysFromNow(1), assignee: "You", status: "todo" },
  { id: "task-03", title: "Follow up with Yaw Darko", priority: "low", dueDate: daysFromNow(3), assignee: "You", status: "todo" },
  { id: "task-04", title: "Draft negotiation terms for Adjoa Boateng", priority: "high", dueDate: daysFromNow(1), assignee: "You", status: "in_progress" },
  { id: "task-05", title: "Verify business registration document", priority: "medium", dueDate: daysFromNow(2), assignee: "You", status: "in_progress" },
  { id: "task-06", title: "Update Cantonments listing description", priority: "low", dueDate: daysFromNow(5), assignee: "You", status: "in_progress" },
  { id: "task-07", title: "Send welcome email to Kwabena Owusu", priority: "medium", dueDate: daysFromNow(-2), assignee: "You", status: "completed" },
  { id: "task-08", title: "Schedule Spintex inspection", priority: "high", dueDate: daysFromNow(-1), assignee: "You", status: "completed" },
];

interface TasksState {
  tasks: Task[];
  moveStatus: (id: string, status: TaskStatus) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: MOCK_TASKS,
      moveStatus: (id, status) => {
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, status } : t)) });
      },
    }),
    { name: "nowe-agent-tasks" }
  )
);
