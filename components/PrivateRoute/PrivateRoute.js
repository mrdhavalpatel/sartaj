import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import useProtectedRoute from "../../hooks/useProtectedRoute";

const PrivateRoute = ({ children, authCheck = false }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { user: protectedUser } = useProtectedRoute();

  useEffect(() => {
    if (authCheck && (!user || !protectedUser)) {
      router.replace("/page-login");
    }
  }, [user, protectedUser, router, authCheck]);

  return !authCheck || (authCheck && user && protectedUser) ? (
    <>{children}</>
  ) : null;
};

export default PrivateRoute;
