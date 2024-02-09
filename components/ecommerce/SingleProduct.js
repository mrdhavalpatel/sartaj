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
import { translatedItemDetails } from "../../util/util";

const SingleProduct = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
}) => {
  const intl = useIntl();
  const handleCart = async (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product);
    // toast("Product added to Cart !",{autoClose: 200,});
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
            <Link
              href={`/${
                intl.locale === "eng" ? product?.seo_en : product?.seo_ja
              }`}
            >
              {Array.isArray(product?.image) &&
                product?.image?.map((itm) => {
                  return <img className="default-img" src={itm} alt="nest" />;
                })}
            </Link>
          </div>
          <div className="product-action-1">
            <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
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

          <div className="product-badges product-badges-position product-badges-mrg">
            {product?.badges?.map((Itm) => {
              return (
                <>
                  {Itm == "new" && <span className="new">New</span>}
                  {Itm == "hot" && <span className="hot">Hot</span>}
                  {Itm == "sale" && <span className="sale">Sale</span>}
                </>
              );
            })}
          </div>
        </div>
        <div className="product-content-wrap">
          <div className="product-category">
            <Link
              href={`/${
                intl.locale === "eng"
                  ? product?.manufacturer?.seo_en
                  : product?.manufacturer?.seo_ja
              }`}
            >
              {product?.manufacturer?.name}
            </Link>
          </div>
          <h2 className="ellipsis-title">
            <Link
              href={`/${
                intl.locale === "eng" ? product?.seo_en : product?.seo_ja
              }`}
              as={`/${
                intl.locale === "eng" ? product?.seo_en : product?.seo_ja
              }`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: translatedItemDetails("name", intl, product),
                }}
              />
            </Link>
          </h2>

          {product?.overall_rating ? (
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
                {/* {product?.rating} */}
              </span>
            </div>
          ) : (
            intl.formatMessage({ id: "No reviews available" })
          )}

          <div className="comapny_name">
            <span className="font-small text-muted">
              {intl.formatMessage({ id: "By" })}{" "}
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
              <span>¥{product.actual_price} </span>
              {product.actual_price == product.price ? null : (
                <span className="old-price">
                  {product.price && `¥ ${product.price}`}
                </span>
              )}
            </div>
            {/* <div className="product-price">
              <span>¥{product.price} </span>
              <span className="old-price">
                {product.oldPrice && `¥ ${product.oldPrice}`}
              </span>
            </div> */}
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
                  //maximum_order_quantity
                  if (product?.out_of_stock_status == "in stock") {
                    handleCart(product);
                  } else {
                    toast.error("product is out of stock");
                  }
                }}
              >
                <i className="fi-rs-shopping-cart mr-5"></i>{" "}
                {product?.out_of_stock_status !== "in stock"
                  ? intl.formatMessage({ id: "Out of stock" })
                  : intl.formatMessage({ id: "Add" })}
              </button>
            </div>
          </div>
        </div>
        <QuickView />
      </div>
    </>
  );
};

const mapDispatchToProps = {
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
