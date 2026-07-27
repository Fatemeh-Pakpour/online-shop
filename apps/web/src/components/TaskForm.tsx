import { useState, type FormEvent } from 'react';

interface TaskFormProps {
  disabled: boolean;
  onSubmit: (title: string) => Promise<unknown>;
}

export function TaskForm({ disabled, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || disabled) return;

    await onSubmit(trimmed);
    setTitle('');
  }

  return (
    <form className="task-form" onSubmit={(event) => void handleSubmit(event)}>
      <input
        className="task-input"
        type="text"
        value={title}
        maxLength={200}
        placeholder="What needs to be done?"
        aria-label="Task title"
        onChange={(event) => setTitle(event.target.value)}
      />
      <button className="button" type="submit" disabled={disabled || title.trim().length === 0}>
        {disabled ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
