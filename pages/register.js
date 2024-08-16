import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { auth } from "../lib/auth/auth";
import { toast } from "sonner";
import DateInput from "../components/customDatePicker/DateInput";
import { useIntl } from "react-intl";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import Image from "next/image";
import Sentsvg from "../public/assets/sentemail.svg";
import CreateAccount from "../public/assets/createaccount.svg"
function Privacy() {
  const intl = useIntl();
  const [sent, setSent] = useState(false);

  const router = useRouter();
  const allowedCountries = ["JP"];
  const validationSchema = Yup.object().shape({
    f_name: Yup.string().required(
      intl.formatMessage({ id: "First name is required" })
    ),
    l_name: Yup.string().required(
      intl.formatMessage({ id: "Last name is required" })
    ),
    email: Yup.string()
      .email(intl.formatMessage({ id: "Invalid email address" }))
      .required(intl.formatMessage({ id: "Email is required" })),
    termsConditions: Yup.boolean()
      .oneOf(
        [true],
        intl.formatMessage({ id: "Terms & Conditions are required" })
      )
      .required(intl.formatMessage({ id: "Terms & Conditions are required" })),
    phone: Yup.string()
      .required(intl.formatMessage({ id: "Phone number is required" }))
      .matches(
        /^\d{10}$/,
        intl.formatMessage({
          id: "Phone number must be 10 digits",
        })
      ),
    password: Yup.string()
      .min(
        8,
        intl.formatMessage({ id: "Password must be at least 8 characters" })
      )
      .required(intl.formatMessage({ id: "Password is required" })),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        intl.formatMessage({ id: "Passwords must match" })
      )
      .required(intl.formatMessage({ id: "Confirm password is required" })),
    dob: Yup.date()
      .nullable()
      .required(intl.formatMessage({ id: "Date of Birth is required" })),
  });

  const handleSubmit = (values) => {
    const payload = {
      f_name: values.f_name,
      l_name: values.l_name,
      email: values.email,
      phone: "+81" + values.phone,
      password: values.confirmPassword,
      dob: values?.dob,
    };

    auth("post", "/auth/register", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        setSent(true);
        window.scrollTo({ top: 10, behavior: "smooth" });
      }
    });
  };

  return (
    <Layout parent="Home" sub="Pages" subChild="Privacy">
      <div className="account_page page-content pt-150 pb-150">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
              <div className="row">
                <div className="col-lg-6 pr-30 d-none d-lg-block">
                  <Image
                    priority
                    src={sent ? Sentsvg:CreateAccount}
                    alt="next"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="col-lg-6 col-md-8">
                  <div className="login_wrap widget-taber-content background-white">
                    {sent ? (
                      <div>
                        <h1 className="mb-10">
                          Account Verification Email Sent
                        </h1>
                        <p>
                          An email has been sent to verify your account. Please
                          check your inbox and spam folder.
                        </p>
                        <div className="mt-15">
                          <Link href="/sign-in">
                            <button className="btn btn-primary">Sign in</button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="padding_eight_all bg-white">
                        <div className="heading_s1 mb-50">
                          <h1 className="mb-5">
                            {intl.formatMessage({ id: "Create an Account" })}
                          </h1>
                          <p>
                            {intl.formatMessage({
                              id: "Already have an account?",
                            })}{" "}
                            <Link href="/sign-in">
                              <strong>
                                {intl.formatMessage({ id: "Login instead!" })}
                              </strong>
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
                            phone: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={(values, { setSubmitting }) => {
                            handleSubmit(values);
                            setSubmitting(false);
                          }}
                        >
                          {({ setFieldValue, values }) => (
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

                            <div
                              className="form-group"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <input
                                type="text"
                                id="countryCode"
                                name="countryCode"
                                value="+81"
                                disabled
                                style={{ width: "70px", marginRight: "5px" }}
                              />
                              <Field
                                type="number"
                                id="phone"
                                name="phone"
                                value={values.phone}
                                onChange={(e) => {
                                  const inputValue = e.target.value.slice(
                                    0,
                                    10
                                  ); // Limit to 10 characters
                                  setFieldValue("phone", inputValue);
                                }}
                              />
                            </div>
                            <div>
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

                            <div className="login_footer mb-50">
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
                                        id: "I agree to",
                                      })}{" "}
                                      {intl.locale =="eng" ?
                                         <a
                                         href="/terms_conditions"
                                         target="_blank"
                                       >
                                         {intl.formatMessage({
                                           id: "Terms & Conditions",
                                         })}
                                       </a>:
                                          <a
                                          href="/jp/terms_conditions"
                                          target="_blank"
                                        >
                                          {intl.formatMessage({
                                            id: "Terms & Conditions",
                                          })}
                                        </a>}
                                   
                                    </span>
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="termsConditions"
                                  component="div"
                                  style={{ color: "red" }}
                                />
                              </div>
                             
                            </div>

                            <button
                              type="submit"
                              className="btn btn-fill-out btn-block hover-up font-weight-bold"
                              name="login"
                            >
                              {intl.formatMessage({
                                id: "Submit & Register",
                              })}
                            </button>

                            <p className="font-xs text-muted mt-3">
                              <strong>
                                {intl.formatMessage({ id: "Note:" })}
                              </strong>
                              {intl.formatMessage({
                                id: "Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy",
                              })}
                            </p>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Privacy;
