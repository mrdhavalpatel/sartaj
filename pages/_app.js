// _app.js
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
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

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const { locale = "eng" } = useRouter();

  const messages = {
    eng: eng,
    jp: jp,
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
