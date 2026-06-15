import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Project } from "@/types"
import { nodeBaseApi } from "@/app/services"

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    workspaceId: "1",
    name: "Website Redesign",
    key: "WEB",
    description: "Redesigning the company website",
    ownerId: "1",
    status: "active",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    workspaceId: "1",
    name: "Mobile App",
    key: "MOB",
    description: "New mobile application",
    ownerId: "1",
    status: "active",
    startDate: new Date("2023-06-01"),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const projectsApi = nodeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], string>({
      queryFn: async (workspaceId) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
          data: mockProjects.filter((p) => p.workspaceId === workspaceId),
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "ProjectList" as const, id }))]
          : [{ type: "ProjectList", id: "LIST" }],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      queryFn: async (project) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const newProject: Project = {
          ...(project as Project),
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        // In a real app, we wouldn't be pushing to a local array unless mocking fully
        // mockProjects.push(newProject);
        return { data: newProject }
      },
      invalidatesTags: ["ProjectList"],
    }),
  }),
})

export const { useGetProjectsQuery, useCreateProjectMutation } = projectsApi
