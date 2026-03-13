import { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/tables/DataTable';
import { apiRequest } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

type StaffRole = 'STATE_REVIEWER' | 'CENTRAL_REVIEWER';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  state?: string | null;
  isActive: boolean;
}

interface UsersResponse {
  success: boolean;
  users: AdminUser[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('STATE_REVIEWER');
  const [state, setState] = useState('');
  const [organization, setOrganization] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError('');

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setLoadError('Admin session missing. Please login again.');
      setUsers([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest<UsersResponse>('/api/admin/users', {
        method: 'GET',
        token,
      });
      setUsers(response.users);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const updateUserStatus = async (user: AdminUser) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setActionError('Admin session missing. Please login again.');
      return;
    }

    setActionError('');
    setActionLoadingId(user._id);

    try {
      await apiRequest(`/api/admin/users/${user._id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      await loadUsers();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setActionError('Admin session missing. Please login again.');
      return;
    }

    setActionError('');
    setActionLoadingId(user._id);

    try {
      await apiRequest(`/api/admin/users/${user._id}`, {
        method: 'DELETE',
        token,
      });
      await loadUsers();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }, [users, search]);

  const onCreateStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name || !email || !password) {
      setFormError('Name, email and password are required.');
      return;
    }

    if (role === 'STATE_REVIEWER' && !state) {
      setFormError('State is required for State Reviewer.');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setFormError('Admin session missing. Please login again.');
      return;
    }

    setIsCreating(true);

    try {
      await apiRequest('/api/admin/users/staff', {
        method: 'POST',
        token,
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          state: role === 'STATE_REVIEWER' ? state : undefined,
          organization,
        }),
      });

      setFormSuccess(`${role === 'STATE_REVIEWER' ? 'State' : 'Central'} reviewer created successfully.`);
      setName('');
      setEmail('');
      setPassword('');
      setState('');
      setOrganization('');
      await loadUsers();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create staff user');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative z-10 w-full font-sans">
      {/* Fixed Background for User Management */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.25]"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80")' }}
      />

      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
        <h2 className="text-3xl font-serif font-extrabold text-slate-800 drop-shadow-sm tracking-tight">User Management</h2>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 p-6 md:p-8 space-y-4">
        <h3 className="text-base font-semibold">Create Reviewer Account</h3>

        <form onSubmit={onCreateStaff} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="gov-label">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="gov-input" placeholder="Reviewer name" />
            </div>

            <div>
              <label className="gov-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="gov-input" placeholder="reviewer@gov.in" />
            </div>

            <div>
              <label className="gov-label">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="gov-input" placeholder="Temporary password" />
            </div>

            <div>
              <label className="gov-label">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="gov-input">
                <option value="STATE_REVIEWER">State Reviewer</option>
                <option value="CENTRAL_REVIEWER">Central Reviewer</option>
              </select>
            </div>

            {role === 'STATE_REVIEWER' && (
              <div>
                <label className="gov-label">State</label>
                <input value={state} onChange={(e) => setState(e.target.value)} className="gov-input" placeholder="e.g. Maharashtra" />
              </div>
            )}

            <div>
              <label className="gov-label">Organization</label>
              <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="gov-input" placeholder="Department/Authority" />
            </div>
          </div>

          {formError && <p className="text-xs text-destructive">{formError}</p>}
          {formSuccess && <p className="text-xs text-accent">{formSuccess}</p>}

          <button type="submit" disabled={isCreating} className="gov-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md hover:shadow-lg transition-all">
            Create Reviewer Account
          </button>
        </form>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 overflow-hidden px-6 py-6">
      <DataTable title="All Users" searchPlaceholder="Search users..." onSearch={setSearch}>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Email</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Role</th>
              <th className="px-6 py-4 font-medium hidden lg:table-cell">Organization</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading users...</td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-destructive">{loadError}</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No users found.</td>
              </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-foreground/80 hidden sm:table-cell">{user.email}</td>
                <td className="px-6 py-4 text-foreground/80 hidden md:table-cell">{user.role}</td>
                <td className="px-6 py-4 text-foreground/80 hidden lg:table-cell">{user.organization || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'gov-status-approved' : 'gov-status-pending'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => updateUserStatus(user)} disabled={actionLoadingId === user._id} className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">{user.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => deleteUser(user)} disabled={actionLoadingId === user._id} className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      </div>
      {actionError && <p className="text-xs text-destructive bg-white/50 p-2 rounded-md">{actionError}</p>}
    </div>
  );
}
