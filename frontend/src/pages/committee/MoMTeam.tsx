import { useEffect, useMemo, useState } from 'react';
import { apiRequest, API_BASE_URL } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

type BackendSimpleRef = {
  _id: string;
  projectName?: string;
  meetingTitle?: string;
};

type BackendGistEntry = {
  summary?: string;
  recommendation?: 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'DEFERRED';
  application?: string | BackendSimpleRef;
};

type BackendGist = {
  _id: string;
  status?: 'DRAFT' | 'FINALIZED';
  applications?: BackendGistEntry[];
};

type BackendMoM = {
  _id: string;
  status?: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
  content?: string;
  publishedAt?: string;
};

type BackendDashboardApplication = {
  _id: string;
  projectName: string;
  state?: string;
  district?: string;
  clearanceType?: string;
  status: string;
  isLocked?: boolean;
  gistId?: BackendGist | null;
  momId?: BackendMoM | null;
  meetingId?: BackendSimpleRef | null;
};

type DashboardResponse = {
  success: boolean;
  applications: BackendDashboardApplication[];
};

type RecordResponse = {
  success: boolean;
  application: BackendDashboardApplication;
  gist: BackendGist | null;
  mom: BackendMoM | null;
};

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const findGistEntry = (gist: BackendGist | null, applicationId: string) => {
  if (!gist?.applications?.length) {
    return null;
  }

  return gist.applications.find((entry) => {
    const id = typeof entry.application === 'string'
      ? entry.application
      : entry.application?._id;

    return id === applicationId;
  }) || gist.applications[0];
};

export default function MoMTeam() {
  const [applications, setApplications] = useState<BackendDashboardApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedApplication, setSelectedApplication] = useState<BackendDashboardApplication | null>(null);
  const [gist, setGist] = useState<BackendGist | null>(null);
  const [mom, setMom] = useState<BackendMoM | null>(null);
  const [gistText, setGistText] = useState('');
  const [recommendation, setRecommendation] = useState<'RECOMMENDED' | 'NOT_RECOMMENDED' | 'DEFERRED'>('DEFERRED');
  const [isEditingGist, setIsEditingGist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedRecordLocked = Boolean(selectedApplication?.isLocked);

  const loadDashboard = async (keepSelection = true) => {
    const token = getToken();

    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      setErrorMessage('');
      const response = await apiRequest<DashboardResponse>('/api/mom/team/dashboard', {
        method: 'GET',
        token,
      });

      setApplications(response.applications || []);

      if (response.applications.length === 0) {
        setSelectedId('');
        setSelectedApplication(null);
        setGist(null);
        setMom(null);
        setGistText('');
        return;
      }

      const nextSelectedId = keepSelection && selectedId
        ? selectedId
        : response.applications[0]._id;

      setSelectedId(nextSelectedId);
      await loadRecord(nextSelectedId, token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load MoM team dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecord = async (applicationId: string, tokenParam?: string) => {
    const token = tokenParam || getToken();

    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      return;
    }

    try {
      setErrorMessage('');
      const response = await apiRequest<RecordResponse>(`/api/mom/team/application/${applicationId}`, {
        method: 'GET',
        token,
      });

      setSelectedApplication(response.application);
      setGist(response.gist);
      setMom(response.mom);

      const entry = findGistEntry(response.gist, applicationId);
      setGistText(entry?.summary || '');
      setRecommendation(entry?.recommendation || 'DEFERRED');
      setIsEditingGist(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load application record');
    }
  };

  useEffect(() => {
    void loadDashboard(false);
  }, []);

  const handleSelect = async (applicationId: string) => {
    setSelectedId(applicationId);
    await loadRecord(applicationId);
  };

  const handleSaveGist = async () => {
    if (!selectedId) {
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      return;
    }

    if (!gistText.trim()) {
      setErrorMessage('Please enter edited gist text before saving.');
      return;
    }

    setIsBusy(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiRequest(`/api/mom/team/application/${selectedId}/gist`, {
        method: 'PUT',
        token,
        body: JSON.stringify({
          summary: gistText,
          recommendation,
        }),
      });

      setSuccessMessage('Gist updated successfully.');
      await loadDashboard();
      setIsEditingGist(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update gist');
    } finally {
      setIsBusy(false);
    }
  };

  const handleConvertToMoM = async () => {
    if (!selectedId) {
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      return;
    }

    setIsBusy(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiRequest(`/api/mom/team/application/${selectedId}/convert`, {
        method: 'POST',
        token,
      });

      setSuccessMessage('MoM draft generated from edited gist using Gemini conversion.');
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to convert gist to MoM');
    } finally {
      setIsBusy(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedId) {
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      return;
    }

    const confirmed = window.confirm('Publish final MoM? This will approve and lock the application.');
    if (!confirmed) {
      return;
    }

    setIsBusy(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await apiRequest(`/api/mom/team/application/${selectedId}/publish`, {
        method: 'POST',
        token,
      });

      setSuccessMessage('MoM published. Application approved and locked successfully.');
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to publish MoM');
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenPdf = async () => {
    if (!mom?._id) {
      return;
    }

    const token = getToken();
    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/mom/${mom._id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download MoM PDF');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to open MoM PDF');
    }
  };

  const displayRows = useMemo(() => {
    return applications.map((application) => ({
      ...application,
      hasGist: Boolean(application.gistId?._id),
      hasMoM: Boolean(application.momId?._id),
    }));
  }, [applications]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold text-foreground">MoM Team - Committee Review</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Meeting management dashboard for gist editing, Gemini-based MoM conversion, and secure final publication.
        </p>
      </div>

      {(errorMessage || successMessage) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${errorMessage ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-primary/30 bg-primary/5 text-primary'}`}>
          {errorMessage || successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 rounded-xl border border-border bg-surface overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm font-medium">Applications in Committee Workflow</div>
          <div className="max-h-[560px] overflow-auto">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading applications...</div>
            ) : displayRows.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No committee applications available.</div>
            ) : (
              <div className="divide-y divide-border">
                {displayRows.map((application) => (
                  <button
                    key={application._id}
                    onClick={() => void handleSelect(application._id)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors ${selectedId === application._id ? 'bg-primary/5' : ''}`}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{application.projectName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{application.state || '-'} • {application.clearanceType || '-'}</p>
                      </div>
                      <span className={`text-[11px] px-2 py-1 rounded-full border ${application.isLocked ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                        {application.isLocked ? 'Locked' : 'Open'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>Gist: {application.hasGist ? 'Yes' : 'No'}</span>
                      <span>•</span>
                      <span>MoM: {application.hasMoM ? 'Yes' : 'No'}</span>
                      <span>•</span>
                      <span>Status: {application.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-3 space-y-5">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Selected Application</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedApplication ? `${selectedApplication.projectName} (${selectedApplication.status})` : 'Select an application from the list'}
                </p>
              </div>
              {selectedApplication?.meetingId?.meetingTitle && (
                <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
                  Meeting: {selectedApplication.meetingId.meetingTitle}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Gist Editing (Clear Text)</h3>
              <button
                type="button"
                onClick={() => setIsEditingGist((value) => !value)}
                disabled={!selectedApplication || selectedRecordLocked || isBusy}
                className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted/60 disabled:opacity-50"
              >
                {isEditingGist ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-sm md:col-span-1">
                <span className="text-muted-foreground">Recommendation</span>
                <select
                  value={recommendation}
                  onChange={(event) => setRecommendation(event.target.value as 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'DEFERRED')}
                  disabled={!isEditingGist || selectedRecordLocked || isBusy}
                  className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="RECOMMENDED">Recommended</option>
                  <option value="NOT_RECOMMENDED">Not Recommended</option>
                  <option value="DEFERRED">Deferred</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-muted-foreground">Edited Gist</span>
              <textarea
                value={gistText}
                onChange={(event) => setGistText(event.target.value)}
                disabled={!isEditingGist || selectedRecordLocked || isBusy}
                rows={14}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Enter committee-updated gist text here..."
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleSaveGist()}
                disabled={!selectedApplication || !isEditingGist || selectedRecordLocked || isBusy}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                Save Gist
              </button>
              <span className="text-xs text-muted-foreground">Gist must be saved before conversion.</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-base font-semibold text-foreground">MoM Conversion & Finalization</h3>
            <p className="text-sm text-muted-foreground">
              Convert edited gist into a formal MoM using Gemini, then publish to lock the application and set final approval.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleConvertToMoM()}
                disabled={!selectedApplication || selectedRecordLocked || isBusy}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted/60 disabled:opacity-50"
              >
                Convert Gist to MoM
              </button>

              <button
                type="button"
                onClick={() => void handlePublish()}
                disabled={!selectedApplication || selectedRecordLocked || !mom?._id || isBusy}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                Publish Final MoM
              </button>

              <button
                type="button"
                onClick={() => void handleOpenPdf()}
                disabled={!mom?._id || isBusy}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted/60 disabled:opacity-50"
              >
                Open MoM PDF
              </button>
            </div>

            <div className="rounded-md border border-border bg-background p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">MoM Status:</span> {mom?.status || 'Not generated'}</p>
              <p><span className="text-muted-foreground">Application Status:</span> {selectedApplication?.status || '-'}</p>
              <p><span className="text-muted-foreground">Application Lock:</span> {selectedApplication?.isLocked ? 'Locked' : 'Not Locked'}</p>
              <p><span className="text-muted-foreground">Published At:</span> {mom?.publishedAt ? new Date(mom.publishedAt).toLocaleString() : '-'}</p>
            </div>

            <label className="block">
              <span className="text-sm text-muted-foreground">Generated MoM Preview (read-only)</span>
              <textarea
                value={mom?.content || ''}
                readOnly
                rows={14}
                className="mt-1 w-full rounded-md border border-border bg-muted/20 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
