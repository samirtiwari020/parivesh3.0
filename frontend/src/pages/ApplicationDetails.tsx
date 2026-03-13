import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, MapPin, Download } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import StatusTimeline from '@/components/dashboard/StatusTimeline';
import { apiRequest, API_BASE_URL } from '@/lib/api';
import type { ApplicationStatus } from '@/types';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

type ReviewAction = 'APPROVE' | 'REJECT' | 'FORWARD' | 'SEND_BACK';

interface BackendDocument {
  _id: string;
  documentName: string;
  documentType: string;
}

interface BackendHistoryItem {
  status: string;
  remarks?: string;
  date?: string;
}

interface BackendApplication {
  _id: string;
  projectName: string;
  projectDescription?: string;
  sector?: string;
  category?: string;
  clearanceType: 'EC' | 'FC' | 'WL' | 'CRZ';
  state: string;
  district?: string;
  projectCost?: number;
  status: string;
  createdAt: string;
  applicant?: {
    name?: string;
    email?: string;
    organization?: string;
  };
  documents?: BackendDocument[];
  history?: BackendHistoryItem[];
}

interface ApplicationResponse {
  success: boolean;
  application: BackendApplication;
}

const statusMap: Record<string, ApplicationStatus> = {
  DRAFT: 'Pending',
  SUBMITTED: 'Submitted',
  UNDER_SCRUTINY: 'Under Review',
  EDS_RAISED: 'Under Review',
  RESUBMITTED: 'Under Review',
  REFERRED_TO_MEETING: 'Committee Review',
  IN_MEETING: 'Committee Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const mapStatus = (value: string): ApplicationStatus => statusMap[value] || 'Pending';

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB');
};

export default function ApplicationDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [application, setApplication] = useState<BackendApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null);

  const section = useMemo(() => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/state')) return 'state';
    return 'central';
  }, [location.pathname]);

  const backPath = section === 'admin'
    ? '/admin/applications'
    : section === 'state'
      ? '/state/review'
      : '/central/applications';

  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  const loadApplication = async () => {
    if (!id) return;

    if (!token) {
      setLoadError('Session expired. Please login again.');
      setApplication(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError('');

    try {
      const response = await apiRequest<ApplicationResponse>(`/api/applications/${id}`, {
        method: 'GET',
        token,
      });
      setApplication(response.application);
    } catch (error) {
      setApplication(null);
      setLoadError(error instanceof Error ? error.message : 'Failed to load application');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplication();
  }, [id]);

  const takeAction = async (action: ReviewAction) => {
    if (!id || !token) return;

    setActionError('');
    setPendingAction(action);

    try {
      await apiRequest(`/api/applications/${id}/review`, {
        method: 'POST',
        token,
        body: JSON.stringify({ action }),
      });
      await loadApplication();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDownloadDocument = async (documentId: string, documentName: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/download/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document', error);
      alert('Error downloading document. It may have been removed or unavailable.');
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto text-center py-16 text-muted-foreground">Loading application details...</div>;
  }

  if (loadError || !application) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Link to={backPath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Applications
        </Link>
        <div className="gov-card p-6 text-destructive">{loadError || 'Application not found.'}</div>
      </div>
    );
  }

  const currentStatus = mapStatus(application.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={backPath} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} /> Back to Applications
      </Link>

      <div className="gov-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-2">{application.projectName}</h1>
            <p className="text-sm text-muted-foreground tabular-data">Application ID: {application._id}</p>
          </div>
          <StatusBadge status={currentStatus} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <Building size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Proponent</p>
              <p className="text-sm font-medium">{application.applicant?.organization || application.applicant?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <MapPin size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{application.state}{application.district ? `, ${application.district}` : ''}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
            <Calendar size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium tabular-data">{formatDateTime(application.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-3">
              {[
                ['Clearance Type', application.clearanceType],
                ['Sector', application.sector || '—'],
                ['Category', application.category || '—'],
                ['Estimated Cost', application.projectCost ? `₹${application.projectCost}` : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-right">{value}</span>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4">Documents</h2>
            <div className="space-y-2">
              {application.documents && application.documents.length > 0 ? application.documents.map((document) => (
                <div key={document._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <span className="block text-sm font-medium">{document.documentName}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{document.documentType}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(document._id, document.documentName)}
                    title="Download document"
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Download size={18} />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No documents uploaded.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
            <StatusTimeline currentStatus={currentStatus} />

            <h2 className="text-lg font-semibold mt-8 mb-4">Review History</h2>
            <div className="space-y-3">
              {application.history && application.history.length > 0 ? application.history.slice().reverse().map((item, index) => (
                <div key={`${item.status}-${index}`} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{mapStatus(item.status)}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(item.date)}</span>
                  </div>
                  {item.remarks ? <p className="text-xs text-muted-foreground mt-1">{item.remarks}</p> : null}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No status history yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold mb-3">Review Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => takeAction('APPROVE')}
              disabled={pendingAction !== null}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => takeAction('REJECT')}
              disabled={pendingAction !== null}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            {section !== 'admin' && (
              <button
                onClick={() => takeAction('FORWARD')}
                disabled={pendingAction !== null}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-status-review/10 text-status-review hover:bg-status-review/20 transition-colors disabled:opacity-50"
              >
                Forward
              </button>
            )}
            {section === 'central' && (
              <button
                onClick={() => takeAction('SEND_BACK')}
                disabled={pendingAction !== null}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-status-pending/10 text-status-pending hover:bg-status-pending/20 transition-colors disabled:opacity-50"
              >
                Send Back
              </button>
            )}
          </div>
          {actionError && <p className="text-xs text-destructive mt-3">{actionError}</p>}
        </div>
      </div>
    </div>
  );
}
