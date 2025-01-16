import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { RoutesName } from "./RoutesNames.jsx";
import Loader from "../components/Loader/Loader.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
// import PageNotFound from "../layouts/PageNotFound.jsx";

const AppRoutes = () => {
  let userRole = "user"; 

  return (
    <Router>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="h-screen w-full">
            <Loader />
          </div>
        }
      >
        <Routes>
          {/* Auth routes without MainLayout */}
          {RoutesName["authRoutes"].map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Routes with MainLayout */}
          <Route element={<MainLayout />}>
            {/* Default route */}
            <Route index element={<Navigate to="/home" replace />} />

            {/* Public Routes */}
            {RoutesName["publicRoutes"].map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {RoutesName[`${userRole}Routes`]?.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* Fallback Route */}
            {/* <Navigate to="/home" replace /> */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;