import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { auth } from "../lib/auth/auth";
import { toast } from "react-toastify";
import DateInput from "../components/customDatePicker/DateInput";
import { useIntl } from "react-intl";
function Privacy() {
  const router = useRouter();
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    f_name: Yup.string().required("First name is required"),
    l_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    termsConditions: Yup.boolean()
      .oneOf([true], "Terms & Conditions are required")
      .required("Terms & Conditions are required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{9}$/, "Phone number must be 9 digits"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    dob: Yup.date().nullable().required("Date of Birth is required"),
  });
  const handleSubmit = (values) => {
    const payload = {
      f_name: values.f_name,
      l_name: values.l_name,
      email: values.email,
      phone: values.phone,
      password: values.confirmPassword,
      dob: values?.dob,
    };
    auth("post", "/auth/register", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        router.push("/page-login");
      }
    });
  };

  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Privacy">
        <div className="page-content pt-150 pb-150">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                <div className="row">
                  <div className="col-lg-6 col-md-8">
                    <div className="login_wrap widget-taber-content background-white">
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1 mb-50">
                          <h1 className="mb-5">
                            {intl.formatMessage({ id: "Create an Account" })}
                          </h1>
                          <p>
                            {intl.formatMessage({
                              id: "Already have an account?",
                            })}{" "}
                            <Link href="/page-login">
                              {intl.formatMessage({ id: "Log in instead!" })}
                            </Link>
                          </p>
                        </div>

                        <Formik
                          initialValues={{
                            f_name: "",
                            l_name: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            termsConditions: "",
                            dob: "",
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
                                name="f_name"
                                placeholder={intl.formatMessage({
                                  id: "First Name",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="f_name"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <div className="form-group">
                              <Field
                                type="text"
                                name="l_name"
                                placeholder={intl.formatMessage({
                                  id: "Last Name",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="l_name"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <div className="form-group">
                              <Field
                                type="text"
                                name="email"
                                placeholder={intl.formatMessage({
                                  id: "Email",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <div className="form-group">
                              <Field
                                type="number"
                                name="phone"
                                placeholder={intl.formatMessage({ id: "phone no." })}
                                className="form-control no-spinners" // Add a custom class for styling
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>  
                            <Field
                              name="dob"
                              label="Date of Birth"
                              placeholder={intl.formatMessage({
                                id: "Select Date of Birth",
                              })}
                              component={DateInput}
                            />
                            <div className="form-group">
                              <Field
                                type="password"
                                name="password"
                                placeholder={intl.formatMessage({
                                  id: "Password",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>
                            <div className="form-group">
                              <Field
                                type="password"
                                name="confirmPassword"
                                placeholder={intl.formatMessage({
                                  id: "Confirm password",
                                })}
                                className="form-control"
                              />
                              <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>

                            <div className="login_footer form-group mb-50">
                              <div className="chek-form">
                                <div className="custome-checkbox">
                                  <Field
                                    className="form-check-input"
                                    type="checkbox"
                                    name="termsConditions"
                                    id="exampleCheckbox12"
                                  // value=""
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleCheckbox12"
                                  >
                                    <span>
                                      {intl.formatMessage({
                                        id: "I agree to terms",
                                      })}{" "}
                                      &amp;{" "}
                                      {intl.formatMessage({ id: "Policy." })}
                                    </span>
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="termsConditions"
                                  component="div"
                                  style={{ color: "red" }}
                                />
                              </div>
                              <Link href="/page-privacy-policy">
                                <i className="fi-rs-book-alt mr-5 text-muted"></i>
                                {intl.formatMessage({ id: "Lean more" })}
                              </Link>
                            </div>

                            <p className="font-xs text-muted">
                              <strong>
                                {intl.formatMessage({ id: "Note:" })}
                              </strong>
                              {intl.formatMessage({
                                id: "Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy",
                              })}
                            </p>
                            <button
                              type="submit"
                              className="btn btn-fill-out btn-block hover-up font-weight-bold"
                              name="login"
                            >
                              {intl.formatMessage({ id: "Submit & Register" })}
                            </button>
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

export default Privacy;
