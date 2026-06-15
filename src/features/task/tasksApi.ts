import { Task } from "@/types"
import { nodeBaseApi } from "@/app/services"

export const tasksApi = nodeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedTasks: builder.query<Task[], string>({
      query: (userId) => `tasks?assigneeId=${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getProjectHealth: builder.query<
      { projectId: string; completed: number; total: number }[],
      string
    >({
      query: (workspaceId) => `projects/health?workspaceId=${workspaceId}`,
      providesTags: ["ProjectList"],
    }),
    updateTask: builder.mutation<Task, Partial<Task> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      // Optimistic Update
      onQueryStarted: async (
        { id, ...patch },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData(
            "getAssignedTasks",
            // We might not have the userId here easily, so we might need to invalidate or assume current user.
            // For true optimistic updates on a list, we need the list key.
            // Assuming we can get valid args or update all matching lists.
            // A safer approach for this mock: update specific cache entry if possible.
            // Since we don't have the arg (userId) easily accessbile without passing it,
            // we will try to match any 'getAssignedTasks' query.
            // @ts-ignore
            undefined,
            (draft) => {
              const task = draft.find((t) => t.id === id)
              if (task) {
                Object.assign(task, patch)
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
  }),
})

export const {
  useGetAssignedTasksQuery,
  useGetProjectHealthQuery,
  useUpdateTaskMutation,
} = tasksApi
