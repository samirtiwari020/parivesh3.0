import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';
import type { ApplicationStatus } from '@/types';

interface BackendApplication {
  _id: string;
  projectName: string;
  clearanceType: string;
  state: string;
  createdAt: string;
  status: string;
}

interface BackendApplicationsResponse {
  success: boolean;
  applications: BackendApplication[];
}

export interface ApplicantApplication {
  id: string;
  projectName: string;
  clearanceType: string;
  state: string;
  submissionDate: string;
  createdAt: string;
  status: ApplicationStatus;
}

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

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

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB');
};

export function useApplicantApplications() {
  const [applications, setApplications] = useState<ApplicantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setApplications([]);
      setLoadError('Please sign in to view applications.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiRequest<BackendApplicationsResponse>('/api/applications', {
        method: 'GET',
        token,
      });

      const mapped = response.applications.map((app) => ({
        id: app._id,
        projectName: app.projectName,
        clearanceType: app.clearanceType,
        state: app.state,
        createdAt: app.createdAt,
        submissionDate: formatDate(app.createdAt),
        status: statusMap[app.status] || 'Pending',
      }));

      setApplications(mapped);
    } catch (error) {
      setApplications([]);
      setLoadError(error instanceof Error ? error.message : 'Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const metrics = useMemo(() => {
    const approved = applications.filter((app) => app.status === 'Approved').length;
    const pending = applications.filter((app) => ['Pending', 'Under Review', 'Committee Review', 'Submitted'].includes(app.status)).length;
    const rejected = applications.filter((app) => app.status === 'Rejected').length;

    return {
      total: applications.length,
      approved,
      pending,
      rejected,
    };
  }, [applications]);

  return {
    applications,
    isLoading,
    loadError,
    metrics,
    refetch,
  };
}