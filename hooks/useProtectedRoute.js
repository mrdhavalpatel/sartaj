import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../components/context/AuthContext";

const useProtectedRoute = () => {
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const storedToken = localStorage.getItem("token");

      if (!user && storedToken) {
        try {
          await login({ token: storedToken });
        } catch (error) {
          console.error("Error validating token:", error);
        }
      }

      if (!user) {
        router.replace("/page-login");
      }
    };

    checkUserAuthentication();
  }, [user, router, login]);

  return { user };
};

export default useProtectedRoute;
