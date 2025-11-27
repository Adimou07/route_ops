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

// Réponse réelle de /auth/login : { user: User, token: { type, token, ... } }
interface LoginResponse {
  user: User;
  token: {
    type: string;
    name: string | null;
    token: string;
    abilities: string[];
    lastUsedAt: string | null;
    expiresAt: string | null;
  };
}

export async function login(payload: LoginPayload): Promise<User> {
  const data = await apiClient.post<LoginResponse>("/auth/login", payload);

  // Stocker le token pour les appels suivants et marquer l'authentification
  localStorage.setItem("authToken", data.token.token);
  localStorage.setItem("isAuthenticated", "true");

  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  // L'API renvoie { user: User } sur /auth/me
  const res = await apiClient.get<{ user: User }>("/auth/me");
  return res.user;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    localStorage.removeItem("isAuthenticated");
  }
}
