import { TaskForm } from '../../components/TaskForm';
import { TaskItem } from '../../components/TaskItem';
import { useTasks } from './useTasks';

export function TasksPage() {
  const { tasks, loading, error, creating, createTask, toggleTask, deleteTask } = useTasks();
  const openCount = tasks.filter((task) => !task.completed).length;

  return (
    <main className="page">
      <header className="page-header">
        <h1>Tasks</h1>
        <p className="page-subtitle">
          {openCount} open · {tasks.length} total
        </p>
      </header>

      <TaskForm disabled={creating} onSubmit={createTask} />

      {loading && <p className="state">Loading tasks…</p>}
      {error && <p className="state state-error">Could not load tasks: {error.message}</p>}
      {!loading && !error && tasks.length === 0 && <p className="state">No tasks yet.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={(id) => void toggleTask(id)}
            onDelete={(id) => void deleteTask(id)}
          />
        ))}
      </ul>
    </main>
  );
}
