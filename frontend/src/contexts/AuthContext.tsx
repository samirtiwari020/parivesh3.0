import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole, state?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const mockUsers: Record<UserRole, AuthUser> = {
  [UserRole.APPLICANT]: { id: '1', name: 'Rajesh Kumar', email: 'rajesh@nhai.gov.in', role: UserRole.APPLICANT, organization: 'NHAI' },
  [UserRole.STATE_REVIEWER]: { id: '2', name: 'Amit Patel', email: 'amit@guj.gov.in', role: UserRole.STATE_REVIEWER, state: 'Maharashtra', organization: 'GPCB Gujarat' },
  [UserRole.CENTRAL_REVIEWER]: { id: '3', name: 'Priya Sharma', email: 'priya@moef.gov.in', role: UserRole.CENTRAL_REVIEWER, organization: 'MoEFCC' },
  [UserRole.ADMIN]: { id: '4', name: 'Sunita Verma', email: 'sunita@admin.gov.in', role: UserRole.ADMIN, organization: 'NIC' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string, role: UserRole, state?: string) => {
    const mockUser = { ...mockUsers[role], email };
    if (state) mockUser.state = state;
    setUser(mockUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
