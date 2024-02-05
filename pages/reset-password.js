import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const intl = useIntl();
  const router = useRouter();

  // const validationSchema = Yup.object().shape({
  //   password: Yup.string()
  //     .min(8, intl.formatMessage("Password must be at least 8 characters"))
  //     .required(intl.formatMessage({ id: "Password is required" })),
  //   confirmPassword: Yup.string()
  //     .oneOf([Yup.ref("password"), null], "Passwords must match")
  //     .required("Confirm password is required"),
  // });
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(
        8,
        intl.formatMessage({
          id: "Password must be at least 8 characters",
        })
      )
      .required(intl.formatMessage({ id: "Password is required" })),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        intl.formatMessage({ id: "Passwords must match" })
      )
      .required(intl.formatMessage({ id: "Confirm password is required" })),
  });
  useEffect(() => {
    if (!router?.query?.token) {
      toast.error("Invalid Url");
    }
  }, []);

  const handleSubmit = (values) => {
    const payload = {
      password: values?.password,
      token: router?.query?.token,
    };
    setIsLoading(true);
    auth("post", "auth/reset-password-mail", payload)
      .then((res) => {
        if (res?.response?.data?.errors) {
          toast.error(res?.response?.data?.errors?.[0]?.message);
        } else {
          toast.success(res?.message);
          router.push("/sign-in");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Forgot password">
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
                            {intl.formatMessage({ id: "Reset password" })}
                          </h1>
                          <p className="mb-30">
                            {intl.formatMessage({
                              id: "Already have an account?",
                            })}{" "}
                            <Link href="/sign-in">
                              {intl.formatMessage({ id: "Log in instead!" })}
                            </Link>
                          </p>
                        </div>
                        <Formik
                          initialValues={{
                            confirmPassword: "",
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
                            <div className="form-group position-relative">
                              <Field
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder={intl.formatMessage({
                                  id: "Your password *",
                                })}
                                className="form-control"
                              />
                              <span
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                              <ErrorMessage
                                name="password"
                                component="div"
                                style={{ color: "red", position: "absolute" }}
                              />
                            </div>
                            <div className="form-group position-relative mt-40">
                              <Field
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder={intl.formatMessage({
                                  id: "Confirm password *",
                                })}
                                className="form-control"
                              />
                              <span
                                className="password-toggle-icon"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <FaEyeSlash />
                                ) : (
                                  <FaEye />
                                )}
                              </span>
                              <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                style={{ color: "red", position: "absolute" }}
                              />
                            </div>

                            <div className="form-group mt-40">
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                                disabled={isLoading}
                              >
                                {intl.formatMessage({
                                  id: `${
                                    isLoading
                                      ? intl.formatMessage({ id: "Requesting" })
                                      : intl.formatMessage({ id: "Reset" })
                                  }`,
                                })}
                                {isLoading && "..."}
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
});
export default connect(mapStateToProps)(ResetPassword);
