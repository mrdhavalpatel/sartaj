// _app.js
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import "../public/assets/css/main.css";
import store from "../redux/store";
import Preloader from "../components/elements/Preloader";
import { useRouter } from "next/router";
import { AuthProvider } from "../components/context/AuthContext";
import { IntlProvider } from "react-intl";
import eng from "../lang/en.json";
import jp from "../lang/jp.json";
import { LanguageProvider } from "../components/context/LanguageContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const { locale = "eng" } = useRouter();
  const router = useRouter();

  const messages = {
    eng: eng,
    jp: jp,
  };

  function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      if (router.pathname.includes("my-account")) {
        return window.location.replace("/sign-in");
      }
    } else {
      if (router.pathname.includes("/sign-in")) {
        return window.location.replace("/");
      } else if (router.pathname.includes("/register")) {
        return window.location.replace("/");
      } else if (router.pathname.includes("/forgot-password")) {
        return window.location.replace("/");
      }
    }
  }
  const handleLoading = (status) => {
    setLoading(status);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      checkAuth();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeStart", () => handleLoading(true));
    router.events.on("routeChangeComplete", () => handleLoading(false));
    router.events.on("routeChangeError", () => handleLoading(false));

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeStart", () => handleLoading(true));
      router.events.off("routeChangeComplete", () => handleLoading(false));
      router.events.off("routeChangeError", () => handleLoading(false));
    };
  }, []);

  return (
    <>
      {!loading ? (
        <AuthProvider>
          <Provider store={store}>
            <LanguageProvider>
              <StorageWrapper>
                <IntlProvider locale={locale} messages={messages[locale]}>
                  <Component {...pageProps} />
                  <ToastContainer />
                  <Toaster position="top-right" richColors />
                </IntlProvider>
              </StorageWrapper>
            </LanguageProvider>
          </Provider>
        </AuthProvider>
      ) : (
        <Preloader />
      )}
    </>
  );
}

export default MyApp;
