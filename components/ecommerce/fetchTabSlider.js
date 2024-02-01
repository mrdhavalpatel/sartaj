import Link from "next/link";
import React, { useEffect, useState } from "react";
// import { fetchByCatagory } from "../../redux/action/product";
import FeaturedSlider from "../sliders/Featured";
import { ApiCall } from "../../lib/other/other";
import { useIntl } from "react-intl";
function FeatchTabSlider({ banners }) {
  const intl = useIntl();
  const [active, setActive] = useState("1");
  const [featured, setFeatured] = useState([]);

  const featuredProduct = async () => {
    const request = await ApiCall("get", intl, "products/trending");
    const allProducts = await request;

    setFeatured(allProducts?.data?.products);
    setActive("1");
  };

  useEffect(() => {
    featuredProduct();
  }, []);

  return (
    <>
      <div className="section-title wow animate__animated animate__fadeIn">
        <h3 className="">{intl.formatMessage({ id: "Daily Best Sells" })}</h3>

        {/* <ul className="nav nav-tabs links" id="myTab-1" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={active === "1" ? "nav-link active" : "nav-link"}
              onClick={featuredProduct}
            >
              Featured
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "2" ? "nav-link active" : "nav-link"}
              onClick={trendingProduct}
            >
              Popular
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "3" ? "nav-link active" : "nav-link"}
              onClick={newArrivalProduct}
            >
              New added
            </button>
          </li>
        </ul> */}
      </div>

      <div className="row">
        <div className="col-lg-3 d-none d-lg-flex wow animate__animated animate__fadeIn">
          <div
            className="banner-img style-2"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div className="banner-text">
              <h2 className="mb-100">{banners?.[1]?.title}</h2>
              <Link href="/products" className="btn btn-xs">
                {intl.formatMessage({ id: "Shop Now" })}{" "}
                <i className="fi-rs-arrow-small-right"></i>
              </Link>
            </div>

            {/* <img
              src={`${banners?.[1]?.banner_logo}`}
              onClick={() => {
                window.location.replace(
                  `${banners?.[1]?.link ? banners?.[1]?.link : "#"}`
                );
              }}
            /> */}
          </div>
        </div>
        <div className="col-lg-9 col-md-12">
          <div className="tab-content wow fadeIn animated" id="myTabContent">
            <div
              className={
                active === "1" ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              <div className="carausel-4-columns-cover card-product-small arrow-center position-relative">
                <FeaturedSlider products={featured} />
              </div>
            </div>

            {/* <div
              className={
                active === "2" ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              <div className="carausel-4-columns-cover card-product-small arrow-center position-relative">
                <TrendingSlider products={trending} />
              </div>
            </div>
            <div
              className={
                active === "3" ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              <div className="carausel-4-columns-cover card-product-small arrow-center position-relative">
                <NewArrivalTabSlider products={newArrival} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
export default FeatchTabSlider;
