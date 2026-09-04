import { gql, type TypedDocumentNode } from '@apollo/client';

export interface Task {
  __typename?: 'Task';
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
// This only defines and parses the query:
export const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    completed
    createdAt
    updatedAt
  }
`;

// The query document is constant
export const TASKS_QUERY: TypedDocumentNode<{ tasks: Task[] }, Record<string, never>> = gql`
  query Tasks {
    tasks {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const CREATE_TASK: TypedDocumentNode<{ createTask: Task }, { title: string }> = gql`
  mutation CreateTask($title: String!) {
    createTask(input: { title: $title }) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const TOGGLE_TASK: TypedDocumentNode<{ toggleTask: Task }, { id: string }> = gql`
  mutation ToggleTask($id: ID!) {
    toggleTask(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const DELETE_TASK: TypedDocumentNode<{ deleteTask: boolean }, { id: string }> = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
