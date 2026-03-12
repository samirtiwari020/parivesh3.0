import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/tables/DataTable';
import { mockApplications } from '@/data/mockData';

export default function Dashboard() {
  const recentApps = mockApplications.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Applications" value="24" icon={<FileText size={20} />} colorClass="text-status-review" delay={0} />
        <StatCard label="Pending Action" value="7" icon={<Clock size={20} />} colorClass="text-status-pending" delay={0.1} />
        <StatCard label="Approved" value="15" icon={<CheckCircle2 size={20} />} colorClass="text-accent" delay={0.2} />
        <StatCard label="Rejected" value="2" icon={<XCircle size={20} />} colorClass="text-destructive" delay={0.3} />
      </div>

      <DataTable title="Recent Applications" searchPlaceholder="Search ID or Name...">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">Proposal ID</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Project Name</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Type</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 md:px-6 py-4 font-medium">Status</th>
              <th className="px-4 md:px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentApps.map((app) => (
              <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 md:px-6 py-4 font-medium tabular-data">{app.id}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{app.projectName}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{app.clearanceType}</td>
                <td className="px-4 md:px-6 py-4 tabular-data text-foreground/80 hidden lg:table-cell">{app.submissionDate}</td>
                <td className="px-4 md:px-6 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <Link to={`/app/proposal/${app.id}`} className="text-primary font-medium text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
