import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Workspace } from '@/types';
import { nodeBaseApi } from '@/app/services';

// Mock data
const mockWorkspaces: Workspace[] = [
    {
        id: '1',
        name: 'My Company',
        slug: 'my-company',
        description: 'Main workspace',
        ownerId: '1',
        avatarUrl: null,
        isActive: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Personal Projects',
        slug: 'personal',
        description: 'My personal side projects',
        ownerId: '1',
        avatarUrl: null,
        isActive: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export const workspacesApi = nodeBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWorkspaces: builder.query<Workspace[], void>({
            queryFn: async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                return { data: mockWorkspaces };
            },
            providesTags: ['Workspace'],
        }),
        getWorkspace: builder.query<Workspace, string>({
            queryFn: async (id) => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                const workspace = mockWorkspaces.find(w => w.id === id);
                if (!workspace) {
                    return { error: { status: 404, statusText: 'Not Found', data: null } };
                }
                return { data: workspace };
            },
        }),
    }),
});

export const { useGetWorkspacesQuery, useGetWorkspaceQuery } = workspacesApi;
