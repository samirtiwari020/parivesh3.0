import DataTable from '@/components/tables/DataTable';
import { mockActivityLogs } from '@/data/mockData';

export default function SystemLogs() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-xl font-serif font-bold text-foreground">System Activity Logs</h2>

      <DataTable title="Activity Logs" searchPlaceholder="Search logs...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">User</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Details</th>
              <th className="px-6 py-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockActivityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">{log.action}</td>
                <td className="px-6 py-4 text-foreground/80 hidden sm:table-cell">{log.user}</td>
                <td className="px-6 py-4 text-foreground/80 hidden md:table-cell">{log.details}</td>
                <td className="px-6 py-4 tabular-data text-muted-foreground">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
