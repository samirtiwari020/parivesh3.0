import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

import PublicLayout from "@/components/layout/PublicLayout";
import ApplicantLayout from "@/components/layout/ApplicantLayout";
import StateReviewerLayout from "@/components/layout/StateReviewerLayout";
import CentralReviewerLayout from "@/components/layout/CentralReviewerLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Manuals from "@/pages/Manuals";
import Helpdesk from "@/pages/Helpdesk";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Clearances from "@/pages/Clearances";

// Applicant pages
import ApplicantDashboard from "@/pages/applicant/ApplicantDashboard";
import SubmitProposal from "@/pages/SubmitProposal";
import Applications from "@/pages/Applications";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import ApplicationDetails from "@/pages/ApplicationDetails";

// State Reviewer pages
import StateDashboard from "@/pages/state/StateDashboard";
import ReviewApplications from "@/pages/state/ReviewApplications";

// Central Reviewer pages
import CentralDashboard from "@/pages/central/CentralDashboard";
import AllApplications from "@/pages/central/AllApplications";
import CommitteeReview from "@/pages/central/CommitteeReview";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminApplications from "@/pages/admin/AdminApplications";
import UserManagement from "@/pages/admin/UserManagement";
import SystemLogs from "@/pages/admin/SystemLogs";

const queryClient = new QueryClient();

const ComingSoon = ({ label }: { label: string }) => (
  <div className="text-center py-12 text-muted-foreground">{label} — Coming Soon</div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/clearances" element={<Clearances />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/manuals" element={<Manuals />} />
              <Route path="/helpdesk" element={<Helpdesk />} />
            </Route>

            {/* Applicant */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.APPLICANT]} />}>
              <Route path="/applicant" element={<ApplicantLayout />}>
                <Route index element={<ApplicantDashboard />} />
                <Route path="submit" element={<SubmitProposal />} />
                <Route path="applications" element={<Applications />} />
                <Route path="documents" element={<ComingSoon label="Documents" />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* State Reviewer */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.STATE_REVIEWER]} />}>
              <Route path="/state" element={<StateReviewerLayout />}>
                <Route index element={<StateDashboard />} />
                <Route path="review" element={<ReviewApplications />} />
                <Route path="applications" element={<ReviewApplications />} />
                <Route path="applications/:id" element={<ApplicationDetails />} />
                <Route path="reports" element={<ComingSoon label="State Reports" />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Central Reviewer */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.CENTRAL_REVIEWER]} />}>
              <Route path="/central" element={<CentralReviewerLayout />}>
                <Route index element={<CentralDashboard />} />
                <Route path="applications" element={<AllApplications />} />
                <Route path="committee" element={<CommitteeReview />} />
                <Route path="applications/:id" element={<ApplicationDetails />} />
                <Route path="committee/:id" element={<ApplicationDetails />} />
                <Route path="reports" element={<ComingSoon label="Central Reports" />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="applications/:id" element={<ApplicationDetails />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="employees" element={<ComingSoon label="Employee Management" />} />
                <Route path="reports" element={<ComingSoon label="Admin Reports" />} />
                <Route path="logs" element={<SystemLogs />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Legacy redirects */}
            <Route path="/app/*" element={<Navigate to="/login" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
