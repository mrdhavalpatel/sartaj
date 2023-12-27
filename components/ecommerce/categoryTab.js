import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import Cat1Tab from "../elements/FeaturedTab";
import Cat2Tab from "../elements/NewArrivalTab";
import Cat3Tab from "../elements/TrendingTab";
import Link from "next/link";
import { ApiCall } from "../../lib/other/other";
import {  useIntl } from "react-intl";
function CategoryTab() {
  const intl = useIntl();
  const [active, setActive] = useState("1");
  const [catAll, setCatAll] = useState([]);
  const [cat1, setCat1] = useState([]);
  const [cat2, setCat2] = useState([]);
  const [cat3, setCat3] = useState([]);

  const catPAll = async () => {
    const request = await ApiCall("post", "products/all");
    const allProducts = await request?.data?.products;
    setCatAll(allProducts);
    setActive("1");
  };
  const catP1 = async () => {
    const request = await ApiCall("get", "products/featured");
    const allProducts = await request?.data?.products;
    setCat1(allProducts);

    setActive("2");
  };

  const catP2 = async () => {
    const request = await ApiCall("get", "products/popular");
    const allProducts = await request?.data?.products;
    setCat2(allProducts);
    setActive("3");
  };
  const catP3 = async () => {
    const request = await ApiCall("get", "products/latest");
    const allProducts = await request?.data?.products;
    setCat3(allProducts);
    setActive("4");
  };

  useEffect(() => {
    catPAll();
  }, []);
  return (
    <>
      <div className="section-title style-2 wow animate__animated animate__fadeIn">
        <h3>{intl.formatMessage({ id: "Popular Products" })}</h3>
        <ul className="nav nav-tabs links" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={active === "1" ? "nav-link active" : "nav-link"}
              onClick={catPAll}
            >
              {intl.formatMessage({ id: "All" })}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "2" ? "nav-link active" : "nav-link"}
              onClick={catP1}
            >
              {intl.formatMessage({ id: "Featured" })}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "3" ? "nav-link active" : "nav-link"}
              onClick={catP2}
            >
              {intl.formatMessage({ id: "Popular" })}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={active === "4" ? "nav-link active" : "nav-link"}
              onClick={catP3}
            >
              {intl.formatMessage({ id: "New added" })}
            </button>
          </li>
        </ul>
      </div>

      <div className="tab-content wow fadeIn animated">
        <div
          className={
            active === "1" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat1Tab products={catAll} />
          </div>
        </div>

        <div
          className={
            active === "2" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat1Tab products={cat1} />
          </div>
        </div>

        <div
          className={
            active === "3" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat2Tab products={cat2} />
          </div>
        </div>
        <div
          className={
            active === "4" ? "tab-pane fade show active" : "tab-pane fade"
          }
        >
          <div className="product-grid-4 row">
            <Cat3Tab products={cat3} />
          </div>
        </div>
      </div>
    </>
  );
}
export default CategoryTab;
