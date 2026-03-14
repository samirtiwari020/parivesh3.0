export enum UserRole {
  APPLICANT = 'APPLICANT',
  STATE_REVIEWER = 'STATE_REVIEWER',
  CENTRAL_REVIEWER = 'CENTRAL_REVIEWER',
  COMMITTEE_REVIEWER = 'COMMITTEE_REVIEWER',
  ADMIN = 'ADMIN',
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  state?: string;
  organization?: string;
}

export interface Proposal {
  id: string;
  projectName: string;
  clearanceType: 'EC' | 'FC' | 'WL' | 'CRZ';
  state: string;
  district: string;
  sector: string;
  status: ProposalStatus;
  submittedBy: string;
  submissionDate: string;
  estimatedCost: string;
  proponent: string;
  remarks?: string;
}

export type ProposalStatus = 'Submitted' | 'State' | 'Central' | 'Committee' | 'Approved' | 'Rejected' | 'Pending' | 'Clarification Requested';

export type ClearanceType = 'Environment' | 'Forest' | 'Wildlife' | 'CRZ';
export type ApplicationStatus = 'Submitted' | 'State' | 'Central' | 'Committee' | 'Approved' | 'Rejected' | 'Pending' | 'Clarification Requested';

export interface Application {
  id: string;
  projectName: string;
  clearanceType: ClearanceType;
  state: string;
  submissionDate: string;
  status: ApplicationStatus;
  sector: string;
  estimatedCost: string;
  proponent: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: ClearanceType | 'CAMPA';
  downloadUrl?: string;
}

export interface Manual {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  downloadUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  date: string;
  category: string;
  read: boolean;
  downloadUrl?: string;
}

export interface StatData {
  name: string;
  received: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface ProposalStep1 {
  projectName: string;
  sector: string;
  category: string;
  estimatedCost: string;
}

export interface ProposalStep2 {
  state: string;
  district: string;
  latitude: string;
  longitude: string;
}

export interface ProposalStep3 {
  clearanceTypes: ClearanceType[];
}

export interface ProposalStep4 {
  documents: File[];
}
