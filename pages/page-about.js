import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { ApiCall } from "../lib/other/other";
import {  useIntl } from "react-intl";
function About() {
  const intl = useIntl();
  const [aboutData, setAboutData] = useState([]);

  const getAboutUsData = async () => {
    const request = await ApiCall("get", "config");
    const aboutUsData = await request;
    setAboutData(aboutUsData?.data?.about_us);
  };
  useEffect(() => {
    getAboutUsData();
  }, []);
  return (
    <>
      <Layout parent="Home" sub="Pages" subChild="About">
        <div className="container  pt-50">
          <div className="row">
            <div className="col-xl-10 col-lg-12 m-auto">
              <section className="row align-items-center mb-50">
                {/* <div className="col-lg-6">
                  <img
                    src="/assets/imgs/page/about.jpg"
                    alt="nest"
                    className="border-radius-15 mb-md-3 mb-lg-0 mb-sm-4"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="pl-25">
                    <h2 className="mb-30">Welcome to Sartaj Co Ltd</h2>
                    <p className="mb-25">
                      Namaste, Sartaj offers you a wide variety of Indian
                      grocery foods with the best quality and outstanding
                      service. We have been serving to Hotel, restaurants, halal
                      food, Japanese curry shop, café and many other food
                      industries for the last 14 years. our goal is only one, to
                      provide an authentic taste of Indian spices and food and
                      full fill customer satisfaction as customer satisfaction
                      is our great achievement.
                    </p>
                    <p className="mb-50">
                      We believe in enhancing the Indian food culture in Japan
                      with Japanese standard quality and great service and
                      increase our relationship with customers.
                    </p>
                  </div>
                </div> */}
                <div dangerouslySetInnerHTML={{ __html: aboutData }}></div>
              </section>
              <section className="text-center mb-50">
                <h2 className="title style-3 mb-40">{intl.formatMessage({ id: "What We Provide?" })}</h2>
                <div className="row">
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-1.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Best Prices & Offers" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-2.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Wide Assortment" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-3.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Free Delivery" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-4.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Easy Returns" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-5.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "100% Satisfaction" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-24">
                    <div className="featured-card">
                      <img
                        src="/assets/imgs/theme/icons/icon-6.svg"
                        alt="nest"
                      />
                      <h4>{intl.formatMessage({ id: "Great Daily Deal" })}</h4>
                      <p>
                      {intl.formatMessage({ id: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form" })}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default About;
