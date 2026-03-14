import type { Application, Notice, Manual, Notification, StatData, User, ActivityLog } from '@/types';

export const mockApplications: Application[] = [
  { id: 'ENV/2024/001', projectName: 'Highway Expansion NH-44', clearanceType: 'Environment', state: 'Maharashtra', district: 'Nagpur', submissionDate: '2024-10-12', status: 'Central', sector: 'Infrastructure', estimatedCost: '₹1,200 Cr', proponent: 'NHAI', coordinates: { latitude: 21.1458, longitude: 79.0882 } },
  { id: 'FOR/2024/089', projectName: 'Solar Park Phase II', clearanceType: 'Forest', state: 'Rajasthan', district: 'Jodhpur', submissionDate: '2024-10-10', status: 'Approved', sector: 'Renewable Energy', estimatedCost: '₹850 Cr', proponent: 'NTPC Ltd', coordinates: { latitude: 26.2389, longitude: 73.0243 } },
  { id: 'WLD/2024/045', projectName: 'Eco-Tourism Resort', clearanceType: 'Wildlife', state: 'Kerala', district: 'Idukki', submissionDate: '2024-10-05', status: 'Pending', sector: 'Tourism', estimatedCost: '₹45 Cr', proponent: 'Kerala Tourism Dev Corp', coordinates: { latitude: 9.9189, longitude: 77.1025 } },
  { id: 'CRZ/2024/012', projectName: 'Port Terminal Expansion', clearanceType: 'CRZ', state: 'Gujarat', district: 'Mundra', submissionDate: '2024-09-28', status: 'Rejected', sector: 'Port & Shipping', estimatedCost: '₹3,500 Cr', proponent: 'Adani Ports', coordinates: { latitude: 22.8222, longitude: 69.7214 } },
  { id: 'ENV/2024/034', projectName: 'Thermal Power Plant Unit 5', clearanceType: 'Environment', state: 'Chhattisgarh', district: 'Korba', submissionDate: '2024-09-20', status: 'Committee', sector: 'Power', estimatedCost: '₹4,200 Cr', proponent: 'NTPC Ltd', coordinates: { latitude: 22.3595, longitude: 82.7501 } },
  { id: 'FOR/2024/102', projectName: 'Mining Expansion Block C', clearanceType: 'Forest', state: 'Jharkhand', district: 'Dhanbad', submissionDate: '2024-09-15', status: 'Submitted', sector: 'Mining', estimatedCost: '₹600 Cr', proponent: 'Coal India Ltd', coordinates: { latitude: 23.7957, longitude: 86.4304 } },
  { id: 'ENV/2024/078', projectName: 'Cement Plant Modernization', clearanceType: 'Environment', state: 'Andhra Pradesh', district: 'Kurnool', submissionDate: '2024-09-10', status: 'Committee', sector: 'Industry', estimatedCost: '₹320 Cr', proponent: 'UltraTech Cement', coordinates: { latitude: 15.8222, longitude: 78.0350 } },
  { id: 'WLD/2024/023', projectName: 'Linear Infrastructure Project', clearanceType: 'Wildlife', state: 'Madhya Pradesh', district: 'Jabalpur', submissionDate: '2024-09-05', status: 'Central', sector: 'Infrastructure', estimatedCost: '₹780 Cr', proponent: 'Indian Railways', coordinates: { latitude: 23.1686, longitude: 79.9339 } },
  { id: 'CRZ/2024/056', projectName: 'Coastal Road Extension', clearanceType: 'CRZ', state: 'Maharashtra', district: 'Mumbai', submissionDate: '2024-08-28', status: 'Approved', sector: 'Infrastructure', estimatedCost: '₹12,000 Cr', proponent: 'BMC Mumbai', coordinates: { latitude: 19.0760, longitude: 72.8777 } },
  { id: 'FOR/2024/145', projectName: 'Wind Farm Installation', clearanceType: 'Forest', state: 'Tamil Nadu', district: 'Tirunelveli', submissionDate: '2024-08-22', status: 'Pending', sector: 'Renewable Energy', estimatedCost: '₹280 Cr', proponent: 'Suzlon Energy', coordinates: { latitude: 8.7139, longitude: 77.7567 } },
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
  { id: '1', title: 'Organization/User Registration Manual', description: 'Complete guide for submitting proposals via PARIVESH 3.0', category: 'General', fileSize: '4.2 MB', downloadUrl: '/Manuals/UserRegistration.pdf' },
  { id: '2', title: 'Environmental Clearance Submission Guide', description: 'Step-by-step walkthrough for EC applications', category: 'Environment', fileSize: '3.1 MB', downloadUrl: '/Manuals/ec_environment_clearance_basic_flow.pdf' },
  { id: '3', title: 'Forest Clearance Application Manual', description: 'Detailed instructions for FC Stage I & II', category: 'Forest', fileSize: '5.6 MB', downloadUrl: '/Manuals/FC_DFO_Role_Manual.pdf' },
  { id: '4', title: 'Wildlife Clearance Process Guide', description: 'Guide for wildlife clearance under WPA 1972', category: 'Wildlife', fileSize: '2.8 MB', downloadUrl: '/Manuals/Wild_Life_PARIVESH2_Process_Flow.pdf' },
  { id: '5', title: 'CRZ Clearance Handbook', description: 'CRZ notification compliance and application guide', category: 'CRZ', fileSize: '3.4 MB', downloadUrl: '/Manuals/CRZ_basic_flow_manual.pdf' },
  { id: '6', title: 'Track your Proposal Manual', description: 'Track your submitted Proposal', category: 'User', fileSize: '6.1 MB', downloadUrl: '/Manuals/TrackYourProposal.pdf' },
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
