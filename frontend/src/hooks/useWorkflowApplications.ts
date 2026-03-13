import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';
import type { ApplicationStatus } from '@/types';

interface BackendApplication {
  _id: string;
  projectName: string;
  sector?: string;
  clearanceType: 'EC' | 'FC' | 'WL' | 'CRZ';
  state: string;
  district?: string;
  status: string;
  createdAt: string;
  applicant?: {
    name?: string;
    organization?: string;
  };
}

interface BackendApplicationsResponse {
  success: boolean;
  applications: BackendApplication[];
}

export interface WorkflowApplication {
  id: string;
  projectName: string;
  sector: string;
  state: string;
  district: string;
  clearanceType: 'EC' | 'FC' | 'WL' | 'CRZ';
  status: ApplicationStatus;
  createdAt: string;
  proponent: string;
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

export function useWorkflowApplications() {
  const [applications, setApplications] = useState<WorkflowApplication[]>([]);
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

      const mapped = response.applications.map((application) => ({
        id: application._id,
        projectName: application.projectName,
        sector: application.sector || '-',
        state: application.state,
        district: application.district || '-',
        clearanceType: application.clearanceType,
        status: statusMap[application.status] || 'Pending',
        createdAt: application.createdAt,
        proponent: application.applicant?.organization || application.applicant?.name || '-',
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

  const states = useMemo(() => {
    return [...new Set(applications.map((application) => application.state))].sort();
  }, [applications]);

  return {
    applications,
    states,
    isLoading,
    loadError,
    refetch,
  };
}
