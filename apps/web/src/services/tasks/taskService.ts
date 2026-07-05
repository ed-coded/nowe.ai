import { useTasksStore, TASK_STATUSES, type Task, type TaskStatus, type TaskPriority } from "@/store/tasksStore";

export interface TaskService {
  list: () => Task[];
  listByStatus: () => Record<TaskStatus, Task[]>;
  moveStatus: (id: string, status: TaskStatus) => void;
}

export const taskService: TaskService = {
  list: () => useTasksStore.getState().tasks,
  listByStatus: () => {
    const tasks = useTasksStore.getState().tasks;
    const grouped = Object.fromEntries(TASK_STATUSES.map((s) => [s.value, [] as Task[]])) as Record<
      TaskStatus,
      Task[]
    >;
    for (const task of tasks) grouped[task.status].push(task);
    return grouped;
  },
  moveStatus: (id, status) => useTasksStore.getState().moveStatus(id, status),
};

export { useTasksStore, TASK_STATUSES };
export type { Task, TaskStatus, TaskPriority };
