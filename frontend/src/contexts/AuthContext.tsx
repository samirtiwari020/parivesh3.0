import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole, AuthUser } from '@/types';
import { apiRequest } from '@/lib/api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

interface BackendAuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    state?: string;
    organization?: string;
  };
}

interface BackendProfileResponse {
  success: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    state?: string;
    organization?: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  organization?: string;
  state?: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

const normalizeRole = (role: string): UserRole => {
  const normalizedRole = role.trim().toUpperCase();
  const validRoles = Object.values(UserRole) as string[];

  if (validRoles.includes(normalizedRole)) {
    return normalizedRole as UserRole;
  }

  throw new Error(`Unsupported role returned by server: ${role}`);
};

const mapUser = (user: BackendAuthResponse['user'] | BackendProfileResponse['user']): AuthUser => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: normalizeRole(user.role),
  state: user.state,
  organization: user.organization,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<BackendProfileResponse>('/api/auth/me', {
          method: 'GET',
          token,
        });

        setUser(mapUser(response.user));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest<BackendAuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    const mappedUser = mapUser(response.user);
    setUser(mappedUser);

    return mappedUser;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await apiRequest<BackendAuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        role: payload.role || UserRole.APPLICANT,
      }),
    });

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    const mappedUser = mapUser(response.user);
    setUser(mappedUser);

    return mappedUser;
  };

  const logout = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      try {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          token,
        });
      } catch {
      }
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
