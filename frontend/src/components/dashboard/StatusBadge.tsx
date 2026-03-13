import type { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<string, string> = {
  'Approved': 'gov-status-approved',
  'Rejected': 'gov-status-rejected',
  'Under Review': 'gov-status-review',
  'Committee Review': 'gov-status-review',
  'Submitted': 'bg-muted text-muted-foreground',
  'Recommended': 'gov-status-approved',
  'Pending': 'gov-status-pending',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}
