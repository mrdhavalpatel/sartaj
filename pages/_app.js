import { useEffect, useState } from "react";
// import "react-input-range/lib/css/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import "../public/assets/css/main.css";
import store from "../redux/store";
import Preloader from "./../components/elements/Preloader";
import { useRouter } from "next/router";
import { AuthProvider } from "../components/context/AuthContext";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

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
            <StorageWrapper>
              <Component {...pageProps} />
              <ToastContainer />
            </StorageWrapper>
          </Provider>
        </AuthProvider>
      ) : (
        <Preloader />
      )}
    </>
  );
}

export default MyApp;
