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

interface ProjectsListResponseMeta {
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

interface ProjectsListResponse {
  meta: ProjectsListResponseMeta;
  data: Project[];
}

interface ProjectSingleResponse {
  data: Project;
  message?: string;
}

export async function fetchProjects(page: number = 1): Promise<ProjectsListResponse> {
  const path = page && page !== 1 ? `/projects?page=${page}` : "/projects";
  return apiClient.get<ProjectsListResponse>(path);
}

export async function fetchProjectById(id: number | string): Promise<Project> {
  // L'endpoint GET /projects/{id} renvoie directement un objet Project (sans enveloppe data)
  return apiClient.get<Project>(`/projects/${id}`);
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

export async function updateProject(
  id: number | string,
  input: Partial<Omit<Project, "id" | "code" | "createdBy" | "createdAt" | "updatedAt" | "managerId">>
): Promise<Project> {
  const res = await apiClient.put<ProjectSingleResponse>(`/projects/${id}`, input);
  return res.data;
}
