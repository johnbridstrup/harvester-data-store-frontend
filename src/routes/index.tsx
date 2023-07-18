import { lazy, Suspense } from "react";
import Forbidden from "@/pages/403";
import NotFound from "@/pages/404";
import InternalServerError from "@/pages/500";
import { Routes, Route } from "react-router-dom";
import { RequireUser, UserAuth } from "@/utils/guards";
import { RouteLoader } from "@/components/styled";
import { Loader } from "@/components/common";
const Login = lazy(() => import("@/pages/auth/login"));
const Home = lazy(() => import("@/pages/home"));
const NotificationListView = lazy(
  () => import("@/pages/notification/listview"),
);
const NotificationDetailView = lazy(
  () => import("@/pages/notification/detailview"),
);

function BaseRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <Home />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/login"
        element={
          <UserAuth>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <Login />
            </Suspense>
          </UserAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <NotificationListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/notifications/:notifyId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <NotificationDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/forbidden"
        element={
          <RequireUser>
            <Forbidden />
          </RequireUser>
        }
      />
      <Route path="/internal" element={<InternalServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default BaseRoutes;
