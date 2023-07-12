import Login from "@/pages/auth/login";
import { Routes, Route } from "react-router-dom";

function BaseRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default BaseRoutes;
