import Forbidden from "@/pages/403";
import NotFound from "@/pages/404";
import InternalServerError from "@/pages/500";
import Login from "@/pages/auth/login";
import { Routes, Route } from "react-router-dom";

function BaseRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/internal" element={<InternalServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default BaseRoutes;
