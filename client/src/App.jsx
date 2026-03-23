import { Navigate, Route, Routes } from "react-router-dom";
import Applayout from "./applayout/Applayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import EventDetails from "./pages/admin/EventDetails";
import Login from "./pages/admin/Login";
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
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
