import Layout from "../components/layout/Layout";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
const Gmap = dynamic(() => import("../components/elements/Gmap"), {
  ssr: false,
});

function Contact() {
  const intl = useIntl();
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
                        {intl.formatMessage({ id: "Office" })}
                      </h4>
                      {intl.formatMessage({
                        id: "205 North Michigan Avenue, Suite 810",
                      })}
                      <br />
                      {intl.formatMessage({ id: "Chicago, 60601, USA" })}
                      <br />
                      <abbr title="Phone">
                        {intl.formatMessage({ id: "Phone" })}:
                      </abbr>{" "}
                      (123) 456-7890
                      <br />
                      <abbr title="Email">
                        {intl.formatMessage({ id: "Email" })}:{" "}
                      </abbr>
                      {intl.formatMessage({ id: "contact@Evara.com" })}
                      <br />
                      <a className="btn btn-sm font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                        <i className="fi-rs-marker mr-5"></i>
                        {intl.formatMessage({ id: "View map" })}
                      </a>
                    </div>
                    <div className="col-md-4 mb-4 mb-md-0">
                      <h4 className="mb-15 text-brand">
                        {intl.formatMessage({ id: "Studio" })}
                      </h4>
                      {intl.formatMessage({
                        id: "205 North Michigan Avenue, Suite 810",
                      })}
                      <br />
                      {intl.formatMessage({ id: "Chicago, 60601, USA" })}
                      <br />
                      <abbr title="Phone">
                        {intl.formatMessage({ id: "Phone" })}:
                      </abbr>{" "}
                      (123) 456-7890
                      <br />
                      <abbr title="Email">
                        {intl.formatMessage({ id: "Email" })}:{" "}
                      </abbr>
                      {intl.formatMessage({ id: "contact@Evara.com" })}
                      <br />
                      <a className="btn btn-sm font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                        <i className="fi-rs-marker mr-5"></i>
                        {intl.formatMessage({ id: "View map" })}
                      </a>
                    </div>
                    <div className="col-md-4">
                      <h4 className="mb-15 text-brand">
                        {intl.formatMessage({ id: "Shop" })}
                      </h4>
                      {intl.formatMessage({
                        id: "205 North Michigan Avenue, Suite 810",
                      })}
                      <br />
                      {intl.formatMessage({ id: "Chicago, 60601, USA" })}
                      <br />
                      <abbr title="Phone">
                        {intl.formatMessage({ id: "Phone" })}:
                      </abbr>{" "}
                      (123) 456-7890
                      <br />
                      <abbr title="Email">
                        {intl.formatMessage({ id: "Email" })}:{" "}
                      </abbr>
                      {intl.formatMessage({ id: "contact@Evara.com" })}
                      <br />
                      <a className="btn btn-sm font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                        <i className="fi-rs-marker mr-5"></i>
                        {intl.formatMessage({ id: "View map" })}
                      </a>
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
                        <form
                          className="contact-form-style mt-30"
                          id="contact-form"
                          action="#"
                          method="post"
                        >
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="name"
                                  placeholder={intl.formatMessage({
                                    id: "First Name",
                                  })}
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="email"
                                  placeholder={intl.formatMessage({
                                    id: "Your Email",
                                  })}
                                  type="email"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="telephone"
                                  placeholder={intl.formatMessage({
                                    id: "Your Phone",
                                  })}
                                  type="tel"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="input-style mb-20">
                                <input
                                  name="subject"
                                  placeholder={intl.formatMessage({
                                    id: "Subject",
                                  })}
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="textarea-style mb-30">
                                <textarea
                                  name="message"
                                  placeholder={intl.formatMessage({
                                    id: "Message",
                                  })}
                                ></textarea>
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
                        <p className="form-messege"></p>
                      </div>
                    </div>
                    <div className="col-lg-4 pl-50 d-lg-block d-none">
                      <img
                        className="border-radius-15 mt-50"
                        src="assets/imgs/page/contact-2.png"
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
