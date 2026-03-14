import type { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<string, string> = {
  'Approved': 'gov-status-approved',
  'Rejected': 'gov-status-rejected',
  'State': 'gov-status-review',
  'Central': 'gov-status-review',
  'Committee': 'gov-status-review',
  'Submitted': 'bg-muted text-muted-foreground',
  'Recommended': 'gov-status-approved',
  'Pending': 'gov-status-pending',
  'Clarification Requested': 'gov-status-pending',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}
