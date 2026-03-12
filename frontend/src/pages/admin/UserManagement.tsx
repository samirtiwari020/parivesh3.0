import DataTable from '@/components/tables/DataTable';
import { mockUsers } from '@/data/mockData';

export default function UserManagement() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">User Management</h2>

      <DataTable title="All Users" searchPlaceholder="Search users...">
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
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-foreground/80 hidden sm:table-cell">{user.email}</td>
                <td className="px-6 py-4 text-foreground/80 hidden md:table-cell">{user.role}</td>
                <td className="px-6 py-4 text-foreground/80 hidden lg:table-cell">{user.organization}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'gov-status-approved' : 'gov-status-pending'}`}>{user.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Edit</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
