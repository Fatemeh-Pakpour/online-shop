import { useMutation, useQuery } from '@apollo/client/react';

import { CREATE_TASK, DELETE_TASK, TASKS_QUERY, TOGGLE_TASK, type Task } from '../../graphql/tasks';

export function useTasks() {
  const { data, loading, error } = useQuery(TASKS_QUERY);

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    // Push the new task into the cached list instead of refetching everything.
    update(cache, result) {
      const created = result.data?.createTask;
      if (!created) return;

      cache.updateQuery({ query: TASKS_QUERY }, (existing) =>
        existing ? { tasks: [created, ...existing.tasks] } : { tasks: [created] },
      );
    },
  });

  // toggleTask returns the updated task, so the normalized cache updates itself.
  const [toggleTask] = useMutation(TOGGLE_TASK);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, result, { variables }) {
      if (!result.data?.deleteTask || !variables) return;

      cache.evict({ id: cache.identify({ __typename: 'Task', id: variables.id }) });
      cache.gc();
    },
  });

  return {
    tasks: (data?.tasks ?? []) as Task[],
    loading,
    error,
    creating,
    createTask: (title: string) => createTask({ variables: { title } }),
    toggleTask: (id: string) => toggleTask({ variables: { id } }),
    deleteTask: (id: string) => deleteTask({ variables: { id } }),
  };
}
