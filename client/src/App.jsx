import { Navigate, Route, Routes } from "react-router-dom";
import Applayout from "./applayout/Applayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import AdminApprovedDashboard from "./pages/admin/AdminApprovedDashboard";
import AdminEventReview from "./pages/admin/AdminEventReview";
import EventDetails from "./pages/admin/EventDetails";
import EventOverview from "./pages/admin/EventOverview";
import Login from "./pages/admin/Login";
import TeacherEventsDashboard from "./pages/admin/TeacherEventsDashboard";
import Unauthorized from "./pages/admin/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Applayout />}>
          <Route element={<RoleProtectedRoute allowedRoles={["admin", "faculty"]} />}>
            <Route path="/eventdetails" element={<EventDetails />} />
            <Route path="/event/:eventId" element={<EventOverview />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminApprovedDashboard />} />
            <Route path="/admin/review" element={<AdminEventReview />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/teacher/dashboard" element={<TeacherEventsDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
