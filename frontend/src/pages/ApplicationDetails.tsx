import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, MapPin, Download, AlertTriangle, UploadCloud, Eye } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import StatusTimeline from '@/components/dashboard/StatusTimeline';
import FileUploader from '@/components/forms/FileUploader';
import { EDS_CHECKLIST } from '@/data/projectChecklists';
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
  edsDetails?: {
    isRaised: boolean;
    queries: string[];
    raisedAt: string;
    resolvedAt?: string;
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
  EDS_RAISED: 'Clarification Requested',
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
  const [clarificationComment, setClarificationComment] = useState('');
  const [applicantRemark, setApplicantRemark] = useState('');
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [edsSelectedQueries, setEdsSelectedQueries] = useState<string[]>([]);
  const [edsFiles, setEdsFiles] = useState<Record<string, File[]>>({});
  const [isResolvingEDS, setIsResolvingEDS] = useState(false);
  const [editableFields, setEditableFields] = useState({
    projectName: '',
    projectDescription: '',
    state: '',
    district: '',
    projectCost: '',
  });

  const section = useMemo(() => {
    if (location.pathname.startsWith('/applicant')) return 'applicant';
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/state')) return 'state';
    if (location.pathname.startsWith('/committee')) return 'committee';
    return 'central';
  }, [location.pathname]);

  const backPath = section === 'applicant'
    ? '/applicant/applications'
    : section === 'admin'
    ? '/admin/applications'
    : section === 'committee'
      ? '/committee'
    : section === 'state'
      ? '/state/review'
      : '/central/applications';

  const canForward = section === 'state';
  const canSendBack = section === 'state' || section === 'central' || section === 'committee' || section === 'admin';
  const canReview = section === 'state' || section === 'central' || section === 'committee' || section === 'admin';
  const isApplicantSection = section === 'applicant';
  const canRespondToClarification = isApplicantSection && application?.status === 'EDS_RAISED';

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
      setEditableFields({
        projectName: response.application.projectName || '',
        projectDescription: response.application.projectDescription || '',
        state: response.application.state || '',
        district: response.application.district || '',
        projectCost: response.application.projectCost ? String(response.application.projectCost) : '',
      });
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

    if (action === 'SEND_BACK' && !clarificationComment.trim()) {
      setActionError('Please add a clarification comment before sending back.');
      return;
    }

    setActionError('');
    setPendingAction(action);

    try {
      await apiRequest(`/api/applications/${id}/review`, {
        method: 'POST',
        token,
        body: JSON.stringify({
          action,
          remarks: action === 'SEND_BACK' ? clarificationComment.trim() : undefined,
        }),
      });
      if (action === 'SEND_BACK') {
        setClarificationComment('');
      }
      await loadApplication();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRaiseEDS = async () => {
    if (!id || !token) return;
    if (edsSelectedQueries.length === 0) {
      setActionError('Please select at least one shortcoming to raise an EDS.');
      return;
    }
    setActionError('');
    setPendingAction('SEND_BACK');
    try {
      await apiRequest(`/api/applications/${id}/raise-eds`, {
        method: 'POST',
        token,
        body: JSON.stringify({ queries: edsSelectedQueries }),
      });
      setEdsSelectedQueries([]);
      await loadApplication();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to raise EDS');
    } finally {
      setPendingAction(null);
    }
  };

  const uploadEdsDocument = async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    formData.append('documentName', file.name);
    formData.append('applicationId', id as string);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  };

  const handleResolveEDS = async () => {
    if (!id || !token) return;
    setSaveError('');

    // Validation for EDS documents
    const queries = application?.edsDetails?.queries || [];
    const missingDocs = queries.filter(q => !edsFiles[q] || edsFiles[q].length === 0);

    if (missingDocs.length > 0) {
      setSaveError(`Please upload all requested documents to resolve EDS: ${missingDocs.join(', ')}`);
      return;
    }

    setIsResolvingEDS(true);
    try {
      const uploadTasks = Object.entries(edsFiles).flatMap(([docType, files]) => 
        files.map(file => uploadEdsDocument(file, docType))
      );
      if (uploadTasks.length > 0) {
        await Promise.all(uploadTasks);
      }
      
      await apiRequest(`/api/applications/${id}/resolve-eds`, {
        method: 'POST',
        token,
        body: JSON.stringify({ remarks: applicantRemark.trim() || 'EDS documents uploaded by applicant.' }),
      });
      
      setApplicantRemark('');
      setEdsFiles({});
      setSaveSuccess('EDS Resolved successfully.');
      await loadApplication();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to resolve EDS');
    } finally {
      setIsResolvingEDS(false);
    }
  };

  const handleApplicantUpdate = async () => {
    if (!id || !token) return;

    setSaveError('');
    setSaveSuccess('');

    if (!editableFields.projectName.trim()) {
      setSaveError('Project name is required.');
      return;
    }

    if (canRespondToClarification && !applicantRemark.trim()) {
      setSaveError('Please describe the changes made for clarification.');
      return;
    }

    setIsSavingChanges(true);
    try {
      await apiRequest(`/api/applications/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({
          projectName: editableFields.projectName.trim(),
          projectDescription: editableFields.projectDescription.trim(),
          state: editableFields.state.trim(),
          district: editableFields.district.trim(),
          projectCost: editableFields.projectCost ? Number(editableFields.projectCost) : undefined,
          applicantResponseRemark: applicantRemark.trim(),
        }),
      });

      setApplicantRemark('');
      setSaveSuccess(canRespondToClarification ? 'Application updated and resubmitted successfully.' : 'Application updated successfully.');
      await loadApplication();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to update application');
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleViewDocument = async (documentId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/download/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Intentionally not revoking object URL immediately so the new tab can read it
    } catch (error) {
      console.error('Error viewing document', error);
      alert('Error viewing document. It may have been removed or unavailable.');
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
            {isApplicantSection ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Project Name</label>
                  <input
                    value={editableFields.projectName}
                    onChange={(event) => setEditableFields((previous) => ({ ...previous, projectName: event.target.value }))}
                    className="w-full gov-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Project Description</label>
                  <textarea
                    value={editableFields.projectDescription}
                    onChange={(event) => setEditableFields((previous) => ({ ...previous, projectDescription: event.target.value }))}
                    rows={4}
                    className="w-full gov-input"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">State</label>
                    <input
                      value={editableFields.state}
                      onChange={(event) => setEditableFields((previous) => ({ ...previous, state: event.target.value }))}
                      className="w-full gov-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">District</label>
                    <input
                      value={editableFields.district}
                      onChange={(event) => setEditableFields((previous) => ({ ...previous, district: event.target.value }))}
                      className="w-full gov-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Estimated Cost (₹)</label>
                  <input
                    value={editableFields.projectCost}
                    onChange={(event) => setEditableFields((previous) => ({ ...previous, projectCost: event.target.value }))}
                    className="w-full gov-input"
                  />
                </div>
                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  <p>Clearance Type: {application.clearanceType}</p>
                  <p>Sector: {application.sector || '—'}</p>
                  <p>Category: {application.category || '—'}</p>
                </div>
              </div>
            ) : (
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
            )}

            <h2 className="text-lg font-semibold mt-8 mb-4">Documents</h2>
            <div className="space-y-2">
              {application.documents && application.documents.length > 0 ? application.documents.map((document) => (
                <div key={document._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <span className="block text-sm font-medium">{document.documentName}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{document.documentType}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleViewDocument(document._id)}
                      title="View document in new tab"
                      className="p-2 text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(document._id, document.documentName)}
                      title="Download document"
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download size={18} />
                    </button>
                  </div>
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

        {isApplicantSection ? (
          <div className="mt-8 pt-6 border-t border-border space-y-3">
            {canRespondToClarification && application?.edsDetails?.isRaised ? (
              <div className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center gap-3 text-orange-800 mb-4">
                     <AlertTriangle size={24} />
                     <h3 className="text-lg font-bold">EDS Raised: Action Required</h3>
                  </div>
                  <p className="text-sm text-orange-900/80 mb-6">Officers have requested the following documents or clarifications. Please upload the required files to proceed.</p>
                  
                  <div className="space-y-4 mb-6">
                     {application.edsDetails.queries.map(query => (
                       <div key={query} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                          <p className="font-semibold text-slate-800 mb-3 text-sm">{query}</p>
                          <FileUploader 
                            label={`Upload required file...`} 
                            accept=".pdf,.jpg,.png" 
                            onFilesChange={(files) => setEdsFiles(prev => ({...prev, [query]: files}))}
                          />
                       </div>
                     ))}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 mt-2">Clarification Remarks</h3>
                  <textarea
                    value={applicantRemark}
                    onChange={(event) => setApplicantRemark(event.target.value)}
                    rows={3}
                    placeholder="Describe how you have resolved the shortcomings..."
                    className="w-full gov-input bg-white mt-1 mb-4"
                  />
                  
                  <button
                    onClick={handleResolveEDS}
                    disabled={isResolvingEDS}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
                  >
                    {isResolvingEDS ? 'Resolving...' : <><UploadCloud size={18} /> Resolve EDS & Resubmit</>}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {canRespondToClarification && (
                  <>
                    <h3 className="text-sm font-semibold">Clarification Response</h3>
                    <p className="text-xs text-muted-foreground">Update your application fields and mention what you changed based on reviewer comments.</p>
                    <textarea
                      value={applicantRemark}
                      onChange={(event) => setApplicantRemark(event.target.value)}
                      rows={3}
                      placeholder="Describe the corrections/clarifications you have made..."
                      className="w-full gov-input"
                    />
                  </>
                )}
                <button
                  onClick={handleApplicantUpdate}
                  disabled={isSavingChanges}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSavingChanges ? 'Saving...' : canRespondToClarification ? 'Save Changes & Resubmit' : 'Save Changes'}
                </button>
              </>
            )}
            {saveError && <p className="text-xs text-destructive">{saveError}</p>}
            {saveSuccess && <p className="text-xs text-accent">{saveSuccess}</p>}
          </div>
        ) : canReview ? (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold mb-3">Review Actions</h3>
            {canSendBack && (
              <div className="mb-6 p-5 bg-orange-50/60 backdrop-blur-sm rounded-2xl border border-orange-200/60 shadow-inner">
                <div className="flex items-center gap-2 mb-3 text-orange-800">
                  <AlertTriangle size={18} />
                  <h4 className="font-bold">Essential Document Shortcomings (EDS)</h4>
                </div>
                <p className="text-sm text-orange-900/70 mb-4 font-medium">Select the missing documents or shortcomings to request clarification from the applicant.</p>
                
                <div className="space-y-3 mb-4 max-h-[30vh] overflow-y-auto pr-2" style={{scrollbarWidth: 'thin', scrollbarColor: '#fdba74 transparent'}}>
                  {EDS_CHECKLIST.map((issueLabel) => (
                    <label key={issueLabel} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${edsSelectedQueries.includes(issueLabel) ? 'border-orange-500 bg-orange-100/50 shadow-sm' : 'border-orange-200/50 bg-white hover:border-orange-300 hover:bg-orange-50'}`}>
                      <input 
                        type="checkbox" 
                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                        checked={edsSelectedQueries.includes(issueLabel)}
                        onChange={(e) => {
                          if (e.target.checked) setEdsSelectedQueries(prev => [...prev, issueLabel]);
                          else setEdsSelectedQueries(prev => prev.filter(q => q !== issueLabel));
                        }}
                      />
                      <span className={`text-sm font-medium leading-tight ${edsSelectedQueries.includes(issueLabel) ? 'text-orange-900' : 'text-slate-700'}`}>{issueLabel}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
              {canForward && (
                <button
                  onClick={() => takeAction('FORWARD')}
                  disabled={pendingAction !== null}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-status-review/10 text-status-review hover:bg-status-review/20 transition-colors disabled:opacity-50"
                >
                  Forward
                </button>
              )}
              {canSendBack && (
                <button
                  onClick={handleRaiseEDS}
                  disabled={pendingAction !== null || edsSelectedQueries.length === 0}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle size={15} /> Raise EDS with Applicant
                </button>
              )}
            </div>
            {actionError && <p className="text-xs text-destructive mt-3">{actionError}</p>}
          </div>
        ) : null}
      </div>
    </div>
  );
}
