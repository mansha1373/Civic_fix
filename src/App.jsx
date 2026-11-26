import { Navigate, Route, Routes } from "react-router-dom"
import TransitionProvider from "./components/TransitionProvider.jsx"
import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import ErrorBoundary from "./components/ErrorBoundary.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx"
import ReportIssue from "./pages/ReportIssue.jsx"
import MyReports from "./pages/MyReports.jsx"
import ReportDetails from "./pages/ReportDetails.jsx"
import CommunityMap from "./pages/CommunityMap.jsx"
import Notifications from "./pages/Notifications.jsx"
import CommunityImpact from "./pages/CommunityImpact.jsx"
import Profile from "./pages/Profile.jsx"
import Settings from "./pages/Settings.jsx"

// Admin Dashboard Components & Pages
import AdminLayout from "./components/admin/AdminLayout.jsx"
import AdminLogin from "./pages/admin/AdminLogin.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import AdminComplaints from "./pages/admin/AdminComplaints.jsx"
import AdminDepartments from "./pages/admin/AdminDepartments.jsx"
import AdminCitizens from "./pages/admin/AdminCitizens.jsx"
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx"
import AdminNotifications from "./pages/admin/AdminNotifications.jsx"
import AdminSettings from "./pages/admin/AdminSettings.jsx"

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TransitionProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Public Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Citizen Dashboard Routes - Protected (Citizen Role Only) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["citizen"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="reports/:id" element={<ReportDetails />} />
            <Route path="map" element={<CommunityMap />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="impact" element={<CommunityImpact />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Dashboard Routes - Protected (Admin Role Only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="citizens" element={<AdminCitizens />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TransitionProvider>
    </AuthProvider>
  </ErrorBoundary>
  )
}
