import { storageService } from "../services/storageService";
import type { LoginCredentials, Session, User } from "../types/auth";

const SESSION_KEY = "app_session";

const API_URL = "/api";

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<User> {
    const carnet = credentials.carnet.trim();
    const password = credentials.password;

    if (!carnet || !password) {
      throw new Error("Debe ingresar el carnet y la contraseña.");
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        carnet,
        password,
      }),
    });

    let data: {
      token?: string;
      admin?: User;
      message?: string;
    };

    try {
      data = await response.json();
    } catch {
      throw new Error("El servidor devolvió una respuesta no válida.");
    }

    if (!response.ok) {
      throw new Error(
        data.message ?? "El carnet o la contraseña son incorrectos."
      );
    }

    if (!data.token || !data.admin) {
      throw new Error("El servidor no devolvió una sesión válida.");
    }

    const session: Session = {
      token: data.token,
      admin: data.admin,
    };

    storageService.set<Session>(SESSION_KEY, session);

    return session.admin;
  },

  async logout(): Promise<void> {
    const session = this.getSession();

    if (session?.token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json",
          },
        });
      } catch {
        // Si el servidor no responde,
        // igualmente eliminamos la sesión local.
      }
    }

    storageService.remove(SESSION_KEY);
  },

  getSession(): Session | null {
    return storageService.get<Session>(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    return this.getSession()?.admin ?? null;
  },

  getAuthorizationHeader(): Record<string, string> {
    const token = this.getSession()?.token;

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },
};