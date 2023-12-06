import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import Timer from "./Timer";
import QuickView from "../ecommerce/QuickView";

const Deals1 = ({ product, addToCart }) => {
  const handleCart = (product) => {
    addToCart(product);
    toast("Product added to Cart !");
  };
  return (
    <>
      <div
        className="product-cart-wrap style-2 wow animate__animated animate__fadeInUp"
        data-wow-delay="0"
      >
        <div className="product-img-action-wrap">
          <div className="product-img">
            <Link href="/products">
              <img src={product?.image?.[0]} alt="nest" />
            </Link>
          </div>
        </div>
        <div className="product-content-wrap">
          <div className="deals-countdown-wrap">
            {/* timer */}
            <Timer endDateTime={product?.sale_end_date} />
          </div>
          <div className="deals-content">
            <h2>
              <Link href="/products/[slug]" as={`/products/${product.slug}`}>
                {product.name}
              </Link>
            </h2>
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
            <div>
              <span className="font-small text-muted">
                By <Link href="/vendor/1">{product?.manufacturer?.name}</Link>
              </span>
            </div>
            <div className="product-card-bottom">
              <div className="product-price">
                <span>¥{product?.price}</span>
                <span className="old-price">
                  {product.oldPrice && `¥ ${product.oldPrice}`}
                </span>
              </div>
              <div className="add-cart">
                <a
                  className="add"
                  onClick={(e) => {
                    if (product?.out_of_stock_status == "in stock") {
                      handleCart(product);
                    } else {
                      toast.error("product is out of stock");
                    }
                  }}
                >
                  <i className="fi-rs-shopping-cart mr-5"></i>Add{" "}
                </a>
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
