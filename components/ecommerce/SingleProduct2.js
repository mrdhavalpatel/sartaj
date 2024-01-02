import Link from "next/link";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import QuickView from "./QuickView";
import { useIntl } from "react-intl";

const SingleProduct2 = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
}) => {
  const intl = useIntl();
  const handleCart = (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product);
    // toast("Product added to Cart !");
  };

  const handleCompare = (product) => {
    addToCompare(product);
    // toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product);
    // toast("Added to Wishlist !");
  };
  return (
    <>
      <div className="product-cart-wrap mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            <Link href={`/${product?.seo_en}`}>
              <img className="default-img" src={product?.image} alt="nest" />
              <img className="hover-img" src={product?.image} alt="nest" />
            </Link>
          </div>
          <div className="product-action-1">
            <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
              // data-bs-target="#quickViewModal"
              onClick={(e) => openQuickView(product)}
            >
              <i className="fi-rs-eye"></i>
            </a>
            <a
              aria-label="Add To Wishlist"
              className="action-btn hover-up"
              onClick={(e) => handleWishlist(product)}
            >
              <i className="fi-rs-heart"></i>
            </a>
            <a
              aria-label="Compare"
              className="action-btn hover-up"
              onClick={(e) => handleCompare(product)}
            >
              <i className="fi-rs-shuffle"></i>
            </a>
          </div>

          {/* <div className="product-badges product-badges-position product-badges-mrg">
            {product.trending && <span className="hot">Hot</span>}
            {product.created && <span className="new">New</span>}
            {product.totalSell > 100 && <span className="best">Best Sell</span>}
            {product.discount.isActive && <span className="sale">Sale</span>}
            {product.discount.percentage >= 5 && (
              <span className="hot">{product.discount.percentage}%</span>
            )}
          </div> */}
        </div>
        <div className="product-content-wrap">
          {/* <div className="product-category">
            <Link href="/products">{product?.brand}</Link>
          </div> */}
          <h2>
            <Link href={`/${product?.seo_en}`}>{product?.name}</Link>
          </h2>

          <div className="product-rate d-inline-block">
            <div
              className="product-rating"
              style={{
                width: `${
                  product?.overall_rating ? product.overall_rating : 0
                }%`,
              }}
            ></div>
            <span className="font-small ml-5 text-muted">
              {`(${product?.total_reviews ? product?.total_reviews : 0})`}
            </span>
          </div>
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
          <div className="product-price mt-10">
            {product?.actual_price !== product?.price ? (
              <>
                <span>¥{product?.actual_price}</span>
                <span className="old-price">¥{product?.price}</span>
              </>
            ) : (
              <span>¥{product?.actual_price}</span>
            )}
          </div>

          <div className="sold mt-15 mb-15">
            <div className="progress mb-5">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${
                    ((product?.sold_products || 0) /
                      (product?.total_product_count === 0
                        ? 1
                        : product?.total_product_count || 1)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <span className="font-xs text-heading">
              {" "}
              Sold:{" "}
              {`${product?.sold_products}/${product?.total_product_count}`}
            </span>
          </div>

          <button
            className="btn w-100 hover-up"
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
                toast.error("product is out of stock");
              }
            }}
          >
            <i className="fi-rs-shopping-cart mr-5"></i>{" "}
            {product?.out_of_stock_status !== "in stock"
              ? "Out of stock"
              : "Add To Cart"}{" "}
          </button>
        </div>
      </div>
      <QuickView />
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct2);
