import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthed(isAuthenticated());
    };

    window.addEventListener("auth-state-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    setAuthed(isAuthenticated());

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  if (authed) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : null;
};

export default PublicRoute;
