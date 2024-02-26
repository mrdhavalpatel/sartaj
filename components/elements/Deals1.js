import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import Timer from "./Timer";
import QuickView from "../ecommerce/QuickView";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";

const Deals1 = ({ product, addToCart }) => {
  const intl = useIntl();
  const handleCart = (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product, intl);
    // toast("Product added to Cart !");
  };
  return (
    <>
      <div
        className="product-cart-wrap style-2 wow animate__animated animate__fadeInUp"
        data-wow-delay="0"
      >
          <div className="deals-countdown-wrap d-flex justify-content-center align-items-center">
            {/* timer */}
            <Timer endDateTime={product?.sale_end_date} />
          </div>
        <div className="product-img-action-wrap">
          <div className="product-img">
            <Link href={`/${product?.seo_en}`}>
              <img src={product?.image?.[0]} alt="nest" />
            </Link>
          </div>
        </div>
       
        <div className="product-content-wrap">
       
          <div className="deals-content">
            <h2 className="ellipsis-title">
              <Link href={`/${product?.seo_en}`}><span
                        dangerouslySetInnerHTML={{
                          __html: translatedItemDetails("name", intl, product),
                        }}
                      /></Link>
            </h2>
            {product?.total_reviews > 0 ? (
              <div className="product-rate-cover">
                <div className="product-rate d-inline-block">
                  <div
                    className="product-rating"
                    style={{
                      width: `${
                        product?.overall_rating ? product.overall_rating : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="font-small ml-5 text-muted">
                  {" "}
                  {`(${product?.total_reviews ? product?.total_reviews : 0})`}
                </span>
              </div>
            ) : (
              intl.formatMessage({ id: "No reviews available" })
            )}
            <div>
              <span className="font-small text-muted">
                By{" "}
                <Link
                  href={`/${
                    intl.locale === "eng"
                      ? product?.manufacturer?.seo_en
                      : product?.manufacturer?.seo_ja
                  }`}
                >
                  {product?.manufacturer?.name}
                </Link>
              </span>
            </div>
            <div className="product-card-bottom">
              <div className="product-price">
                <span>¥{product?.actual_price}</span>
                <span className="old-price">
                  {product.price && `¥ ${product.price}`}
                </span>
              </div>
              <div className="add-cart">
                <button
                  className="add"
                  style={{
                    border: "none",
                    backgroundColor: `${
                      product?.out_of_stock_status !== "in stock" ? "grey" : ""
                    }`,
                  }}
                  disabled={product?.out_of_stock_status !== "in stock"}
                  onClick={(e) => {
                    if (product?.out_of_stock_status == "in stock") {
                      handleCart(product);
                    } else {
                      toast.error(
                        intl.formatMessage({ id: "product is out of stock" })
                      );
                    }
                  }}
                >
                  <i className="fi-rs-shopping-cart mr-5"></i>{" "}
                  {product?.out_of_stock_status !== "in stock"
                    ? "Out of stock"
                    : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
};

export default connect(null, mapDispatchToProps)(Deals1);
