import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isAuthenticated());
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    // Check again on route change
    setAuthed(isAuthenticated());

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [location.pathname]);

  if (!authed) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
};

export default ProtectedRoute;
