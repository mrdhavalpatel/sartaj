import Link from "next/link";
import Layout from "../components/layout/Layout";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function Login() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required("Username or Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleSubmit = (values) => {
    console.log(values);
    const payload = {
      email_or_phone: values?.usernameOrEmail,
      password: values?.password,
    };
    auth("post", "auth/login", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        localStorage.setItem("token", res.token);
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
                          <h1 className="mb-5">Login</h1>
                          <p className="mb-30">
                            Don't have an account?{" "}
                            <Link href="/page-register">Create here</Link>
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
                                placeholder="Username or Email *"
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
                                placeholder="Your password *"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                style={{ color: "red" }}
                              />
                            </div>

                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-heading btn-block hover-up"
                                name="login"
                              >
                                Log in
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

export default Login;
