import Layout from "../components/layout/Layout";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import { API_BASE_URL } from "../lib/api";
import axios from "axios";
import { toast } from "sonner";

const Gmap = dynamic(() => import("../components/elements/Gmap"), {
  ssr: false,
});

function Contact() {
  const intl = useIntl();
  const handleContactform =(value)=>{
   
    const payload={
      "first_name":value.name,
   
      "email":value.email,
      "mobile_no":value.telephone,
      "subject":value.subject,
      "message":value.message
    }
    axios.post(`${API_BASE_URL}inquiry`, payload, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then((res)=>{
//      console.log("res",res.data.message);
  if(res.data.message =="Inquiry sent successfully"){
    toast(intl.formatMessage({ id:"Message sent successfully"}));
  }
    })
    .catch((error) => {
//      console.log("error", error?.code === "ERR_NETWORK");
    });
  } 
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      intl.formatMessage({ id: "First name is required" })
    ),
    email: Yup.string()
      .email(intl.formatMessage({ id: "Invalid email address" }))
      .required(intl.formatMessage({ id: "Email is required" })),
    telephone: Yup.string()
    .required(intl.formatMessage({ id: "Phone number is required" }))
    .matches(
      /^\d{10}$/,
      intl.formatMessage({
        id: "Phone number must be 10 digits",
      })
    ),
    subject: Yup.string().required(
      intl.formatMessage({ id: "Subject is required" })
    ),
    message: Yup.string().required(
      intl.formatMessage({ id: "Message is required" })
    ),
  });

  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="Contact">
        <div className="page-content pt-50">
          <section className="container mb-50 d-none d-md-block">
            <div className="border-radius-15 overflow-hidden">
              <div id="map-panes" className="leaflet-map">
                <iframe
                  className="contact_map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.843435753167!2d135.4287325!3d34.8098806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f0ea898962a7%3A0xffad651a0bf33e66!2sSARTAJ%20FOODS!5e0!3m2!1sen!2sin!4v1695103080016!5m2!1sen!2sin"
                ></iframe>
              </div>
            </div>
          </section>
          <div className="container">
            <div className="row">
              <div className="col-xl-10 col-lg-12 m-auto">
                <section className="mb-50">
                  <div className="row mb-60">
                    <div className="col-md-4 mb-4 mb-md-0">
                      <h4 className="mb-15 text-brand">
                        {intl.formatMessage({ id: "Shop" })}
                      </h4>
                      {intl.formatMessage({
                        id: "osaka-fu, ikeda-shi, koda 2-10-23",
                      })}
                      <br />
                      <abbr title="Phone">
                        {intl.formatMessage({ id: "Phone" })}:
                      </abbr>{" "}
                      072-751-1975
                      <br />
                      <abbr title="Email">
                        {intl.formatMessage({ id: "Email" })}:{" "}
                      </abbr>
                      {intl.formatMessage({ id: "info@sartajfoods.jp" })}
                      <br />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="contact-from-area padding-20-row-col">
                        <h5 className="text-brand mb-10">
                          {intl.formatMessage({ id: "Contact form" })}
                        </h5>
                        <h2 className="mb-10">
                          {intl.formatMessage({ id: "Drop Us a Line" })}
                        </h2>
                        <p className="text-muted mb-30 font-sm">
                          {intl.formatMessage({
                            id: "Your email address will not be published. Required fields are marked *",
                          })}
                        </p>
                
                        <Formik
                          initialValues={{
                            name: "",
                            email: "",
                            telephone: "",
                            subject: "",
                            message: "",
                          }}
                          validationSchema={validationSchema}
                          onSubmit={(values, { resetForm }) => {
//                            // console.log(values);
                            handleContactform(values)
                            // Your form submission logic goes here

                            // Optionally, reset the form after submission
                            resetForm();
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue
                          }) => (
                            <form
                              className="contact-form-style mt-30"
                              id="contact-form"
                              onSubmit={handleSubmit}
                            >
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="input-style mb-20">
                                    <Field
                                      name="name"
                                      placeholder={intl.formatMessage({
                                        id: "First Name",
                                      })}
                                      type="text"
                                      value={values.name}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                      name="name"
                                      component="div"
                                      className="error-message"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="input-style mb-20">
                                    <Field
                                      name="email"
                                      placeholder={intl.formatMessage({
                                        id: "Your Email",
                                      })}
                                      type="email"
                                      value={values.email}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                      name="email"
                                      component="div"
                                      style={{ color: "red" }}
                                      className="error-message"
                                    />
                                  </div>
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
                                name="telephone"
                                value={values.telephone}
                                onChange={(e) => {
                                  const inputValue = e.target.value.slice(
                                    0,
                                    10
                                  ); // Limit to 10 characters
                                  setFieldValue("telephone", inputValue);
                                }}
                              />
                            </div>
                            <ErrorMessage
                                      name="telephone"
                                      component="div"
                                      className="error-message"
                                      style={{ color: "red" }}
                                    />

                                <div className="col-lg-12 col-md-12">
                                  <div className="input-style mb-20">
                                    <Field
                                      name="subject"
                                      placeholder={intl.formatMessage({
                                        id: "Subject",
                                      })}
                                      type="text"
                                      value={values.subject}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                      name="subject"
                                      component="div"
                                      className="error-message"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="textarea-style mb-30">
                                    <Field
                                      name="message"
                                      placeholder={intl.formatMessage({
                                        id: "Message",
                                      })}
                                      as="textarea"
                                      value={values.message}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                      name="message"
                                      component="div"
                                      className="error-message"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                  <button
                                    className="submit submit-auto-width"
                                    type="submit"
                                    
                                  >
                                    {intl.formatMessage({ id: "Send message" })}
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </Formik>

                        <p className="form-messege"></p>
                      </div>
                    </div>
                    <div className="col-lg-4 pl-50 d-lg-block d-none">
                      <img
                        className="border-radius-15 mt-50"
                        src="/assets/imgs/page/contact-us.jpg"
                        
                        alt="nest"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Contact;
