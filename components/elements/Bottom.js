import React, { useState } from "react";
import Link from "next/link";
import BestSellerSlider from "../sliders/BestSeller";
import TrendingSlider2 from "../sliders/Trending2";
import NewArrival2 from "../sliders/NewArrival2";
import TopRatedSlider from "../sliders/TopRated";
import { useIntl } from "react-intl";
const Bottom = () => {
  const intl = useIntl();
  const [active, setActive] = useState("3");
  const [catAll, setCatAll] = useState([]);
  const [cat1, setCat1] = useState([]);
  const [cat2, setCat2] = useState([]);
  const [cat3, setCat3] = useState([]);
  console.log("active n bttom", active)
  return (
    <>
      <section className="bottom_section section-padding mb-30">
        <div className="container">
          <div className="row desktop-bottom">
            <div
              className="bottom_section_mt mt-30 col-xl-3 col-lg-4 col-md-6 mb-sm-5 mb-md-0 wow animate__animated animate__fadeInUp"
              data-wow-delay="0"
            >
              <h4 className="section-title style-1 mb-30  animated animated">
                {intl.formatMessage({ id: "New Arrival" })}
              </h4>
              <div className="product-list-small  animated animated">
                <BestSellerSlider intl={intl} />
              </div>
            </div>
            <div
              className="mt-30 col-xl-3 col-lg-4 col-md-6 mb-md-0 wow animate__animated animate__fadeInUp"
              data-wow-delay=".1s"
            >
              <h4 className="section-title style-1 mb-30  animated animated">
                {intl.formatMessage({ id: "Top Selling" })}
              </h4>
              <div className="product-list-small  animated animated">
                <TrendingSlider2 intl={intl} />
              </div>
            </div>
            <div
              className="mt-30 col-xl-3 col-lg-4 col-md-6 mb-md-0 wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <h4 className="section-title style-1 mb-30  animated animated">
                {intl.formatMessage({ id: "Restock Products" })}
              </h4>
              <div className="product-list-small  animated animated">
                <NewArrival2 intl={intl} />
              </div>
            </div>
            <div
              className="mt-30 col-xl-3 col-lg-4 col-md-6 mb-md-0 wow animate__animated animate__fadeInUp"
              data-wow-delay=".3s"
            >
              <h4 className="section-title style-1 mb-30  animated animated">
                {intl.formatMessage({ id: "Top Rated" })}
              </h4>
              <div className="product-list-small  animated animated">
                <TopRatedSlider intl={intl} />
              </div>
            </div>
          </div>
          <div className="mobile-bottom">
            <ul className="nav nav-tabs links" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={active === "1" ? "nav-link active" : "nav-link"}
                  onClick={() => setActive("1")}
                >
                  {intl.formatMessage({ id: "New Arrival" })}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={active === "2" ? "nav-link active" : "nav-link"}
                  onClick={() => setActive("2")}

                >
                  {intl.formatMessage({ id: "Top Selling" })}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={active === "3" ? "nav-link active" : "nav-link"}
                  onClick={() => setActive("3")}

                >
                  {intl.formatMessage({ id: "Restock Products" })}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={active === "4" ? "nav-link active" : "nav-link"}
                  onClick={() => setActive("4")}


                >
                  {intl.formatMessage({ id: "Top Rated" })}
                </button>
              </li>
            </ul>
            <div className="tab-content wow fadeIn animated">
              <div
                className={
                  active === "1" ? "tab-pane fade show active" : "tab-pane fade"
                }
              >
                <div className="product-list-small  animated animated">
                  <BestSellerSlider intl={intl} />
                </div>
              </div>

              <div
                className={
                  active === "2" ? "tab-pane fade show active" : "tab-pane fade"
                }
              >
                <div className="product-list-small  animated animated">
                  <TrendingSlider2 intl={intl} />
                </div>
              </div>

              <div
                className={
                  active === "3" ? "tab-pane fade show active" : "tab-pane fade"
                }
              >
                <div className="product-list-small  animated animated">
                  <NewArrival2 intl={intl} />
                </div>
              </div>
              <div
                className={
                  active === "4" ? "tab-pane fade show active" : "tab-pane fade"
                }
              >
                <div className="product-list-small  animated animated">
                  <TopRatedSlider intl={intl} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Bottom;
