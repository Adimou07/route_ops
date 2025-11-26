import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  roleId: number;
  code: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  avatar: string | null;
  jobTitle: string | null;
  hireDate: string | null;
  isActive: boolean;
  accountLockout: boolean;
  createdAt: string;
  updatedAt: string;
}

// La vraie réponse de /auth/login devra être ajustée selon ton backend.
// On suppose qu'elle renvoie au moins un token JWT ou similaire.
interface LoginResponse {
  token: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<User> {
  const data = await apiClient.post<LoginResponse>("/auth/login", payload);

  // Stocker le token pour les appels suivants
  localStorage.setItem("authToken", data.token);

  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("authToken") || "";

  // La doc montre un body { token: "..." } pour /auth/me.
  // On utilise POST pour maximiser la compatibilité, tout en gardant
  // le header Bearer ajouté automatiquement par apiClient.
  return apiClient.post<User>("/auth/me", { token });
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    localStorage.removeItem("authToken");
  }
}
