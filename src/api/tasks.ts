import { apiClient } from "./client";

export interface TaskProject {
  id: number;
  code: string;
  title: string;
  description: string;
  customerId: number;
  status: string;
  startDate: string;
  endDate: string | null;
  budget: number;
  priority: string;
  managerId: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignee {
  id: number;
  code: string;
  roleId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  avatar: string | null;
  jobTitle: string;
  hireDate: string;
  isActive: number;
  accountLockout: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  code: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: number;
  assignedTo: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  project?: TaskProject;
  assignee?: TaskAssignee;
}

interface TasksListResponseMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string | null;
  lastPageUrl: string | null;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

interface TasksListResponse {
  meta: TasksListResponseMeta;
  data: Task[];
}

interface TaskSingleResponse {
  data: Task;
  message?: string;
}

export async function fetchTasks(page: number = 1): Promise<TasksListResponse> {
  return apiClient.get<TasksListResponse>(`/tasks?page=${page}`);
}

export async function fetchTaskById(id: number | string): Promise<Task> {
  return apiClient.get<Task>(`/tasks/${id}`);
}

export async function createTask(
  input: Partial<Pick<Task, "title" | "description" | "status" | "priority" | "dueDate" | "projectId" | "assignedTo">>
): Promise<Task> {
  const res = await apiClient.post<TaskSingleResponse>("/tasks", input);
  return res.data;
}

export async function updateTask(id: number | string, input: Partial<Omit<Task, "id" | "code" | "createdBy" | "createdAt" | "updatedAt">>): Promise<Task> {
  const res = await apiClient.put<TaskSingleResponse>(`/tasks/${id}`, input);
  return res.data;
}

export async function deleteTask(id: number | string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

export async function updateTaskStatus(id: number | string, status: string): Promise<Task> {
  const res = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/status`, { status });
  return res.data;
}

export async function assignTask(id: number | string, assignedTo: number | null): Promise<Task> {
  const res = await apiClient.patch<TaskSingleResponse>(`/tasks/${id}/assign`, { assignedTo });
  return res.data;
}

export async function fetchTasksByProject(projectId: number | string): Promise<Task[]> {
  const res = await apiClient.get<{ data: Task[] }>(`/tasks/project/${projectId}`);
  return res.data;
}

export async function fetchTasksByUser(userId: number | string): Promise<Task[]> {
  const res = await apiClient.get<{ data: Task[] }>(`/tasks/user/${userId}`);
  return res.data;
}

export async function fetchOverdueTasks(): Promise<Task[]> {
  const res = await apiClient.get<{ data: Task[] }>("/tasks/overdue");
  return res.data;
}

export async function fetchMyTasks(): Promise<Task[]> {
  const res = await apiClient.get<{ data: Task[] }>("/tasks/my-tasks");
  return res.data;
}
