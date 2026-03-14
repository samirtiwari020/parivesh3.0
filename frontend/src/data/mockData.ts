import type { Application, Notice, Manual, Notification, StatData, User, ActivityLog } from '@/types';

export const mockApplications: Application[] = [
  { id: 'ENV/2024/001', projectName: 'Highway Expansion NH-44', clearanceType: 'Environment', state: 'Maharashtra', submissionDate: '2024-10-12', status: 'Under Review', sector: 'Infrastructure', estimatedCost: '₹1,200 Cr', proponent: 'NHAI' },
  { id: 'FOR/2024/089', projectName: 'Solar Park Phase II', clearanceType: 'Forest', state: 'Rajasthan', submissionDate: '2024-10-10', status: 'Approved', sector: 'Renewable Energy', estimatedCost: '₹850 Cr', proponent: 'NTPC Ltd' },
  { id: 'WLD/2024/045', projectName: 'Eco-Tourism Resort', clearanceType: 'Wildlife', state: 'Kerala', submissionDate: '2024-10-05', status: 'Pending', sector: 'Tourism', estimatedCost: '₹45 Cr', proponent: 'Kerala Tourism Dev Corp' },
  { id: 'CRZ/2024/012', projectName: 'Port Terminal Expansion', clearanceType: 'CRZ', state: 'Gujarat', submissionDate: '2024-09-28', status: 'Rejected', sector: 'Port & Shipping', estimatedCost: '₹3,500 Cr', proponent: 'Adani Ports' },
  { id: 'ENV/2024/034', projectName: 'Thermal Power Plant Unit 5', clearanceType: 'Environment', state: 'Chhattisgarh', submissionDate: '2024-09-20', status: 'Committee Review', sector: 'Power', estimatedCost: '₹4,200 Cr', proponent: 'NTPC Ltd' },
  { id: 'FOR/2024/102', projectName: 'Mining Expansion Block C', clearanceType: 'Forest', state: 'Jharkhand', submissionDate: '2024-09-15', status: 'Submitted', sector: 'Mining', estimatedCost: '₹600 Cr', proponent: 'Coal India Ltd' },
  { id: 'ENV/2024/078', projectName: 'Cement Plant Modernization', clearanceType: 'Environment', state: 'Andhra Pradesh', submissionDate: '2024-09-10', status: 'Recommended', sector: 'Industry', estimatedCost: '₹320 Cr', proponent: 'UltraTech Cement' },
  { id: 'WLD/2024/023', projectName: 'Linear Infrastructure Project', clearanceType: 'Wildlife', state: 'Madhya Pradesh', submissionDate: '2024-09-05', status: 'Under Review', sector: 'Infrastructure', estimatedCost: '₹780 Cr', proponent: 'Indian Railways' },
  { id: 'CRZ/2024/056', projectName: 'Coastal Road Extension', clearanceType: 'CRZ', state: 'Maharashtra', submissionDate: '2024-08-28', status: 'Approved', sector: 'Infrastructure', estimatedCost: '₹12,000 Cr', proponent: 'BMC Mumbai' },
  { id: 'FOR/2024/145', projectName: 'Wind Farm Installation', clearanceType: 'Forest', state: 'Tamil Nadu', submissionDate: '2024-08-22', status: 'Pending', sector: 'Renewable Energy', estimatedCost: '₹280 Cr', proponent: 'Suzlon Energy' },
];

export const mockNotices: Notice[] = [
  { id: '1', title: 'New Guidelines for EIA Report Submission - 2024', date: '2024-10-15', category: 'Environment' },
  { id: '2', title: 'Amendment to Forest Conservation Rules', date: '2024-10-12', category: 'Forest' },
  { id: '3', title: 'Wildlife Habitat Assessment Framework Updated', date: '2024-10-10', category: 'Wildlife' },
  { id: '4', title: 'CRZ Notification Clarification on Mangrove Zones', date: '2024-10-08', category: 'CRZ' },
  { id: '5', title: 'CAMPA Fund Utilization Guidelines Revised', date: '2024-10-05', category: 'CAMPA' },
  { id: '6', title: 'Standard ToR for Category A Projects', date: '2024-10-03', category: 'Environment' },
  { id: '7', title: 'Online Public Hearing Guidelines', date: '2024-09-28', category: 'Environment' },
  { id: '8', title: 'Tree Enumeration Survey Protocol Updated', date: '2024-09-25', category: 'Forest' },
];

export const mockManuals: Manual[] = [
  { id: '1', title: 'User Manual for Project Proponents', description: 'Complete guide for submitting proposals via PARIVESH 3.0', category: 'General', fileSize: '4.2 MB', downloadUrl: '#' },
  { id: '2', title: 'Environmental Clearance Submission Guide', description: 'Step-by-step walkthrough for EC applications', category: 'Environment', fileSize: '3.1 MB', downloadUrl: '#' },
  { id: '3', title: 'Forest Clearance Application Manual', description: 'Detailed instructions for FC Stage I & II', category: 'Forest', fileSize: '5.6 MB', downloadUrl: '#' },
  { id: '4', title: 'Wildlife Clearance Process Guide', description: 'Guide for wildlife clearance under WPA 1972', category: 'Wildlife', fileSize: '2.8 MB', downloadUrl: '#' },
  { id: '5', title: 'CRZ Clearance Handbook', description: 'CRZ notification compliance and application guide', category: 'CRZ', fileSize: '3.4 MB', downloadUrl: '#' },
  { id: '6', title: 'State Authority Processing Manual', description: 'For SEIAA/SEAC members processing applications', category: 'Authority', fileSize: '6.1 MB', downloadUrl: '#' },
];

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Your proposal ENV/2024/001 status updated to Under Review', date: '2024-10-15', category: 'Status Update', read: false },
  { id: '2', title: 'Additional documents required for FOR/2024/089', date: '2024-10-12', category: 'Action Required', read: false },
  { id: '3', title: 'Compliance report deadline approaching for CRZ/2024/056', date: '2024-10-10', category: 'Reminder', read: true },
  { id: '4', title: 'New circular issued by MoEFCC dated 08-Oct-2024', date: '2024-10-08', category: 'Circular', read: true },
  { id: '5', title: 'Portal maintenance scheduled for 20-Oct-2024', date: '2024-10-05', category: 'System', read: true },
];

export const mockStats: StatData[] = [
  { name: 'Environment', received: 4200, approved: 2800, pending: 900, rejected: 500 },
  { name: 'Forest', received: 3100, approved: 1900, pending: 750, rejected: 450 },
  { name: 'Wildlife', received: 1800, approved: 1100, pending: 400, rejected: 300 },
  { name: 'CRZ', received: 2600, approved: 1700, pending: 550, rejected: 350 },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@nhai.gov.in', role: 'Project Proponent', organization: 'NHAI', status: 'Active', joinDate: '2023-01-15' },
  { id: '2', name: 'Priya Sharma', email: 'priya@moef.gov.in', role: 'Central Authority', organization: 'MoEFCC', status: 'Active', joinDate: '2022-06-20' },
  { id: '3', name: 'Amit Patel', email: 'amit@guj.gov.in', role: 'State Authority', organization: 'GPCB Gujarat', status: 'Active', joinDate: '2023-03-10' },
  { id: '4', name: 'Sunita Verma', email: 'sunita@admin.gov.in', role: 'Admin', organization: 'NIC', status: 'Active', joinDate: '2021-11-05' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@coal.gov.in', role: 'Project Proponent', organization: 'Coal India Ltd', status: 'Inactive', joinDate: '2023-07-22' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Proposal Submitted', user: 'Rajesh Kumar', timestamp: '2024-10-15 14:30:22', details: 'ENV/2024/001 - Highway Expansion NH-44' },
  { id: '2', action: 'Status Updated', user: 'Priya Sharma', timestamp: '2024-10-15 11:15:45', details: 'FOR/2024/089 moved to Approved' },
  { id: '3', action: 'User Registered', user: 'System', timestamp: '2024-10-14 09:45:10', details: 'New proponent registration: Vikram Singh' },
  { id: '4', action: 'Document Uploaded', user: 'Amit Patel', timestamp: '2024-10-14 08:20:33', details: 'Compliance report for CRZ/2024/056' },
  { id: '5', action: 'Proposal Rejected', user: 'Priya Sharma', timestamp: '2024-10-13 16:50:18', details: 'CRZ/2024/012 - Insufficient documentation' },
];

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const sectors = [
  'Infrastructure', 'Mining', 'Power', 'Renewable Energy', 'Industry', 'Port & Shipping',
  'Tourism', 'Real Estate', 'Irrigation', 'Nuclear', 'Defense', 'Railway', 'Aviation',
];

export const tickerMessages = [
  'New guidelines for CRZ Clearance issued on 12th Oct 2024',
  'Portal maintenance scheduled for Sunday 02:00 AM IST',
  'Submit compliance reports before 31st March 2025',
  'EIA Notification 2006 amendments notified - refer Gazette',
  'Online public hearing facility now available for all Category A projects',
];
