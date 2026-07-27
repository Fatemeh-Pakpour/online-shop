import type { Task } from '../graphql/tasks';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}`}>
      <label className="task-label">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span>{task.title}</span>
      </label>
      <button
        className="button button-ghost"
        type="button"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}
