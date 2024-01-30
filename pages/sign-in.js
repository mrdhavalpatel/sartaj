import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "../components/context/AuthContext";
import { connect } from "react-redux";
import { API_BASE_URL } from "../lib/api";
import axios from "axios";
import { useIntl } from "react-intl";

function Login({ cartItems }) {
  const router = useRouter();
  const { login } = useAuth();
  const intl = useIntl();
  const addCurrenItems = (token) => {
    if (cartItems?.length > 0) {
      let FCart = cartItems?.map((item) => ({
        product_id: item?.id,
        qty: item?.quantity,
      }));

      let payload = {
        cart: FCart,
      };
      const response = axios
        .post(`${API_BASE_URL}customer/cart/add-items`, payload, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.log("error", error?.code === "ERR_NETWORK");
        });
    }
  };
  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required(
      intl.formatMessage({ id: "Username or Email is required" })
    ),
    password: Yup.string().required({ id: "Password is required" }),
  });
  const handleSubmit = (values) => {
    const payload = {
      email_or_phone: values?.usernameOrEmail,
      password: values?.password,
    };
    auth("post", "auth/login", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        localStorage.setItem("token", res.token);
        addCurrenItems(res.token);

        login(res.token);
        router.push("/");
      }
    });
  };
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Login & Register">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 pr-30 d-none d-lg-block">
                    <img
                      className="border-radius-15"
                      src="assets/imgs/page/login-1.png"
                      alt="nest"
                    />
                  </div>
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1">
                          <h1 className="mb-5">
                            {intl.formatMessage({ id: "Login" })}
                          </h1>
                          <p className="mb-30">
                            {intl.formatMessage({
                              id: "Don't have an account?",
                            })}{" "}
                            <Link href="/page-register">
                              {intl.formatMessage({ id: "Create here" })}
                            </Link>
                          </p>
                        </div>
                        <Formik
                          initialValues={{
                            usernameOrEmail: "",
                            password: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={(values, { setSubmitting }) => {
                            // Handle form submission here
                            handleSubmit(values);
                            setSubmitting(false);
                          }}
                        >
                          <Form>
                            <div className="form-group">
                              <Field
                                type="text"
                                name="usernameOrEmail"
                                placeholder={intl.formatMessage({
                                  id: "Username or Email *",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="usernameOrEmail"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <div className="form-group">
                              <Field
                                type="password"
                                name="password"
                                placeholder={intl.formatMessage({
                                  id: "Your password *",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <p className="mb-30">
                              <Link href="/forgot-password">
                                {intl.formatMessage({ id: "Forgot password" })}
                              </Link>
                            </p>
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                              >
                                {intl.formatMessage({ id: "Login" })}
                              </button>
                            </div>
                          </Form>
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
const mapStateToProps = (state) => ({
  cartItems: state.cart,
  activeCart: state.counter,
});
// const mapDispatchToProps = {
//   closeCart,
//   increaseQuantity,
//   getCartItems,
//   decreaseQuantity,
//   deleteFromCart,
//   openCart,
//   clearCart,
// };
// export default Login;
export default connect(mapStateToProps)(Login);
