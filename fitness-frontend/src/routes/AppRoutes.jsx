import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PageLoader from "../components/common/PageLoader";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Activities = lazy(() => import("../pages/Activities"));
const Recommendations = lazy(() => import("../pages/Recommendations"));
const Profile = lazy(() => import("../pages/Profile"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Login />
                            </Suspense>
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Register />
                            </Suspense>
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Dashboard />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Activities />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recommendations"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Recommendations />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Profile />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Analytics />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Settings />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* Default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
                <Route
                    path="*"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <NotFound />
                        </Suspense>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

export default AppRoutes;