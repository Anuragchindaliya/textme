export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isActive: 'active' | 'inactive';
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPublic = Omit<User, 'passwordHash'>;


export type Workspace = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  avatarUrl: string | null;
  isActive: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invitedBy: string | null;
  joinedAt: Date;
};

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description: string | null;
  ownerId: string;
  status: 'active' | 'archived' | 'completed';
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: 'lead' | 'developer' | 'viewer';
  addedAt: Date;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  taskNumber: number;
  status: 'todo' | 'in_progress' | 'in_review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId: string | null;
  reporterId: string;
  parentTaskId: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskAttachment = {
  id: string;
  taskId: string;
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
};

// API Response Types
export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}