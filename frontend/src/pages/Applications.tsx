import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/tables/DataTable';
import { useApplicantApplications } from '@/hooks/useApplicantApplications';

const PAGE_SIZE = 5;

export default function Applications() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { applications, isLoading, loadError } = useApplicantApplications();

  const filtered = useMemo(() => {
    return applications.filter((app) =>
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.projectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [applications, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <DataTable title="My Applications" searchPlaceholder="Search by ID or project name..." onSearch={(v) => { setSearch(v); setPage(1); }}>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-4 md:px-6 py-4 font-medium">Proposal ID</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden sm:table-cell">Project Name</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">Type</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden md:table-cell">State</th>
              <th className="px-4 md:px-6 py-4 font-medium hidden lg:table-cell">Date</th>
              <th className="px-4 md:px-6 py-4 font-medium">Status</th>
              <th className="px-4 md:px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading applications...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-destructive">{loadError}</td></tr>
            ) : paged.length > 0 ? paged.map((app) => (
              <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-4 md:px-6 py-4 font-medium tabular-data">{app.id}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden sm:table-cell">{app.projectName}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{app.clearanceType}</td>
                <td className="px-4 md:px-6 py-4 text-foreground/80 hidden md:table-cell">{app.state}</td>
                <td className="px-4 md:px-6 py-4 tabular-data text-foreground/80 hidden lg:table-cell">{app.submissionDate}</td>
                <td className="px-4 md:px-6 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-4 md:px-6 py-4 text-right">
                  <Link to={`/applicant/applications`} className="text-primary font-medium text-sm">View</Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No applications found.</td></tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </DataTable>
    </div>
  );
}
