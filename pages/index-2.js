import Link from "next/link";
import CategoryTab from "../components/ecommerce/categoryTab";
import FeatchDeals from "../components/ecommerce/fetchDeals";
import Layout from "../components/layout/Layout";
import Intro2 from "../components/sliders/Intro2";
import FetchTabSlider from "../components/ecommerce/fetchTabSlider";
import Banner5 from "../components/elements/Banner5";
import Bottom from "../components/elements/Bottom";
import IntroPopup from "../components/elements/IntroPopup";
import CategorySlider2 from "../components/sliders/Category2";
import {  useIntl } from "react-intl";
function Index2() {
  const intl = useIntl();
  return (
    <>
      <IntroPopup />
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="home-slider style-2 position-relative mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-12">
                <div className="home-slide-cover">
                  <Intro2 />
                </div>
              </div>

              <div className="col-lg-4 d-none d-xl-block">
                <div className="banner-img style-3 animated animated">
                  <div className="banner-text mt-50">
                    <h2 className="mb-50">
                    {intl.formatMessage({ id: "Delivered" })} <br />
                    {intl.formatMessage({ id: "to" })}
                      <span className="text-brand">
                      {intl.formatMessage({ id: "your" })}
                        <br />
                        {intl.formatMessage({ id: "home" })}
                      </span>
                    </h2>
                    <Link href="/shop-fullwidth" className="btn btn-xs">
                    {intl.formatMessage({ id: "Shop Now" })} <i className="fi-rs-arrow-small-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="banners mb-15">
          <div className="container">
            <div className="row">
              <Banner5 />
            </div>
          </div>
        </section>

        <section className="product-tabs section-padding position-relative">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <CategoryTab />
              </div>
            </div>
          </div>
        </section>
        {/* <section className="banner-2 section-padding pb-0">
                    <div className="container">
                        <Banner2 />
                    </div>
                </section> */}

        <section className="section-padding pb-5">
          <div className="container">
            <FetchTabSlider />
          </div>
        </section>

        <section className="section-padding pb-5">
          <div className="container">
            <div
              className="section-title wow animate__animated animate__fadeIn"
              data-wow-delay="0"
            >
              <h3 className="">{intl.formatMessage({ id: "Deals Of The Day" })}</h3>
              <Link href="/shop-fullwidth" className="show-all">
              {intl.formatMessage({ id: "All Deals" })}
                <i className="fi-rs-angle-right"></i>
              </Link>
            </div>
            <FeatchDeals />
          </div>
        </section>

        <section className="popular-categories section-padding">
          <div className="container">
            <div className="section-title">
              <div className="title">
                <h3>{intl.formatMessage({ id: "Shop by Categories" })}</h3>
                <Link href="/shop-fullwidth" className="show-all">
                {intl.formatMessage({ id: "All Categories" })}
                  <i className="fi-rs-angle-right"></i>
                </Link>
              </div>
            </div>
            <div className="carausel-8-columns-cover position-relative">
              <div className="carausel-8-columns" id="carausel-8-columns">
                <CategorySlider2 />
              </div>
            </div>
          </div>
        </section>

        <Bottom />
      </Layout>
    </>
  );
}

export default Index2;
