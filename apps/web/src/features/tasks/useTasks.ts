import type { Reference } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { CREATE_TASK, DELETE_TASK, TASKS_QUERY, TASK_FIELDS, TOGGLE_TASK, type Task } from '../../graphql/tasks';

export function useTasks() {
  const { data, loading, error } = useQuery(TASKS_QUERY);

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    // Push the new task into the cached list instead of refetching everything.
    update(cache, result) {
      const created = result.data?.createTask;
      if (!created) return;

      const createdTaskRef = cache.writeFragment({
        data: created,
        fragment: TASK_FIELDS,
      });

      if (!createdTaskRef) return;

      cache.modify({
        fields: {
          tasks(existingTaskRefs: readonly Reference[] = [], { readField }) {
            const alreadyExists = existingTaskRefs.some(
              (taskRef) => readField('id', taskRef) === created.id,
            );

            if (alreadyExists) return existingTaskRefs;

            return [createdTaskRef, ...existingTaskRefs];
          },
        },
      });
    },
  });

  // toggleTask returns the updated task, so the normalized cache updates itself.
  const [toggleTask] = useMutation(TOGGLE_TASK);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, result, { variables }) {
      if (!result.data?.deleteTask || !variables) return;

      cache.modify({
        fields: {
          tasks(existingTaskRefs: readonly Reference[] = [], { readField }) {
            return existingTaskRefs.filter(
              (taskRef) => readField('id', taskRef) !== variables.id,
            );
          },
        },
      });

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
