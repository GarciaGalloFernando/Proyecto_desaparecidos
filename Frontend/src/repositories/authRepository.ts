import { storageService } from "../services/storageService";
import type { LoginCredentials, User } from "../types/auth";

const SESSION_KEY = "app_session";
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

interface LoginResponse { user: User; }
interface ErrorResponse { message?: string; }

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const body = (await response.json().catch(() => ({}))) as LoginResponse & ErrorResponse;
    if (!response.ok) throw new Error(body.message ?? "No fue posible iniciar sesión.");

    storageService.set<User>(SESSION_KEY, body.user);
    return body.user;
  },
  logout(): void { storageService.remove(SESSION_KEY); },
  getCurrentUser(): User | null { return storageService.get<User>(SESSION_KEY); },
  isAuthenticated(): boolean { return this.getCurrentUser() !== null; },
};
