import Link from "next/link";
import CategoryTab from "../components/ecommerce/categoryTab";
import FeatchDeals from "../components/ecommerce/fetchDeals";
import Layout from "../components/layout/Layout";
import Intro2 from "../components/sliders/Intro2";
import FetchTabSlider from "../components/ecommerce/fetchTabSlider";
import Bottom from "../components/elements/Bottom";
import IntroPopup from "../components/elements/IntroPopup";
import CategorySlider2 from "../components/sliders/Category2";
import { useEffect, useState } from "react";
import { ApiCall } from "../lib/other/other";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { replaceBaseURL } from "../util/urlUtils";

function Index2() {
  const [adBanner, setAdBanner] = useState([]);
  const intl = useIntl();
  const router = useRouter();
  const currentURL = router.asPath;
  const getBanners = async () => {
    const res = await ApiCall("get", intl, "banners/get-other-banners");
    setAdBanner(res?.data);
  };
  useEffect(() => {
    getBanners();
  }, []);
  useEffect(() => {
    const handleURLModification = () => {
      const modifiedURLEng = replaceBaseURL(currentURL);
      const modifiedURLJp = replaceBaseURL(currentURL, "jp");
    };

    handleURLModification();

    const routeChangeComplete = () => {
      handleURLModification();
    };

    router.events.on("routeChangeComplete", routeChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", routeChangeComplete);
    };
  }, [currentURL, router]);

  return (
    <>
      <IntroPopup />
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="home-slider style-2 position-relative mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-8">
                <div className="home-slide-cover">
                  <Intro2 />
                </div>
              </div>

              <div className="col-lg-4 d-none d-xl-block">
                <div
                  className="banner-img style-3 animated animated"
                  style={{
                    background: `url(${adBanner?.[0]?.image}) no-repeat center bottom / cover`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div className="banner-text mt-50">
                    <h2 className="mb-30">{ intl.locale === "eng" ? adBanner?.[0]?.title : adBanner?.[0]?.title_ja }</h2>
                    <h5 className="mb-30 fw-300">
                      {intl.locale === "eng" ? adBanner?.[0]?.description : adBanner?.[0]?.description_ja }
                    </h5>

                    {/* <Link
                      href={`${adBanner?.[0]?.link}`}
                      className="btn btn-xs"
                    >
                      Learn more <i className="fi-rs-arrow-small-right"></i>
                    </Link> */}
                  </div>

                  <img
                    src={`${
                      adBanner?.[0]?.banner_logo
                        ? adBanner?.[0]?.banner_logo
                        : "#"
                    }`}
                    onClick={() => {
                      window.location.replace(
                        `${adBanner?.[0]?.link ? adBanner?.[0]?.link : "#"}`
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home_producttab product-tabs section-padding position-relative">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <CategoryTab />
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding pb-5">
          <div className="container">
            <FetchTabSlider banners={adBanner} />
          </div>
        </section>

        <section className="section-padding pb-5">
          <div className="container">
            <div
              className="section-title wow animate__animated animate__fadeIn"
              data-wow-delay="0"
            >
              <h3 className="">
                {intl.formatMessage({ id: "Deals Of The Day" })}
              </h3>
              <Link
                href={`/${intl.locale}/shop-fullwidth`}
                className="show-all"
              >
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
                <Link
                  href={`/${intl.locale}/shop-fullwidth`}
                  className="show-all"
                >
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
