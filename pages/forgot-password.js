import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import { useState } from "react";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required(
      intl.formatMessage({ id: "Username or Email is required" })
    ),
  });

  const handleSubmit = (values) => {
    const payload = {
      email_or_phone: values?.usernameOrEmail,
    };
    setIsLoading(true);
    auth("post", "auth/forgot-password", payload)
      .then((res) => {
        if (res?.response?.data?.errors) {
          toast.error(res?.response?.data?.errors?.[0]?.message);
        } else {
          toast.success(res?.message);
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
                            {intl.formatMessage({ id: "Forgot password" })}
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
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                                disabled={isLoading}
                              >
                                {intl.formatMessage({
                                  id: `${isLoading ? "Requesting" : "Request"}`,
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
export default connect(mapStateToProps)(ForgotPassword);
