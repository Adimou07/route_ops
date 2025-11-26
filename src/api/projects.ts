import { apiClient } from "./client";

export interface Project {
  id: number;
  code: string;
  title: string;
  description: string;
  customerId: number | null;
  status: "PENDING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED" | string;
  startDate: string;
  endDate: string | null;
  budget: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  managerId: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsListResponse {
  meta?: unknown;
  data: Project[];
}

interface ProjectSingleResponse {
  data: Project;
  message?: string;
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await apiClient.get<ProjectsListResponse>("/projects");
  return res.data;
}

export async function fetchProjectById(id: number | string): Promise<Project> {
  const res = await apiClient.get<ProjectSingleResponse>(`/projects/${id}`);
  return res.data;
}

export async function createProject(input: Omit<Project, "id" | "code" | "createdBy" | "createdAt" | "updatedAt">): Promise<Project> {
  const res = await apiClient.post<ProjectSingleResponse>("/projects", input);
  return res.data;
}

export async function deleteProject(id: number | string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

export async function updateProjectStatus(id: number | string, status: Project["status"]): Promise<Project> {
  const res = await apiClient.patch<ProjectSingleResponse>(`/projects/${id}/status`, { status });
  return res.data;
}
