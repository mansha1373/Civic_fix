import { Navigate, Route, Routes } from "react-router-dom"
import TransitionProvider from "./components/TransitionProvider.jsx"
import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
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

export default function App() {
  return (
    <AuthProvider>
      <TransitionProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Citizen Dashboard Routes - Protected by Backend Authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
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

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TransitionProvider>
    </AuthProvider>
  )
}
