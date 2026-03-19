import { Navigate, Route, Routes } from "react-router-dom";
import Applayout from "./applayout/Applayout";
import EventDetails from "./pages/admin/EventDetails";

function App() {
  return (
    <Routes>
      <Route element={<Applayout />}>
        <Route path="/eventdetails" element={<EventDetails />} />
        <Route path="*" element={<Navigate to="/eventdetails" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
