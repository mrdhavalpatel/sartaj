import Link from "next/link";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/action/cart";
import Timer from "./Timer";
import QuickView from "../ecommerce/QuickView";
import { findProductIndexById } from "../../util/util";

import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";
import { fetchProduct } from "../../redux/action/product";
import storage from "../../util/localStorage";

const Deals1 = ({
  product,
  addToCart,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
}) => {
  const intl = useIntl();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartDataUpdated, setCartDataUpdated] = useState(false);

  useEffect(() => {
    let Token = storage.get("token");
    const fetchData = () => {
      if (Token) {
        // getCartData(Token);
        setIsLoggedIn(Token);
      } else {
        if (intl.locale !== "eng") {
          // updateProductDetails();
        }
        // setCartProducts(cartItems);
      }
    };
    const timeoutId = setTimeout(fetchData, 700);
    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, cartDataUpdated]);
  const handleCart = (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product, intl);
    // toast("Product added to Cart !");
  };
  const cartItem = cartItems?.find((item) => item?.id === product?.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
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
              <Link href={`/${product?.seo_en}`}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: translatedItemDetails("name", intl, product),
                  }}
                />
              </Link>
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
                {/* <button
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
                </button> */}
                <div className="add-cart">
                  {cartQuantity > 0 ? (
                    <div className="detail-extralink mr-15">
                      <div className="detail-qty border radius ">
                        <a
                          onClick={() => {
                            if (cartQuantity >= 1) {
                              decreaseQuantity(product.id);
                            }
                          }}
                          className="qty-down"
                        >
                          <i className="fi-rs-minus-small"></i>
                        </a>
                        <span className="qty-val">{cartQuantity}</span>
                        <a
                          onClick={() => {
                            if (
                              (cartQuantity
                                ? cartQuantity
                                : cartItem.quantity) <
                              (product?.maximum_order_quantity
                                ? product?.maximum_order_quantity
                                : product?.product?.maximum_order_quantity)
                            ) {
                              const localCartItems = JSON.parse(
                                localStorage.getItem("dokani_cart")
                              );
                              let localCartItemIndex = -1;

                              if (localCartItems) {
                                localCartItemIndex = findProductIndexById(
                                  localCartItems,
                                  cartItem.id
                                );
                              }

                              let productQuantityAllowed = cartItem.total_stock;

                              if (localCartItemIndex >= 0) {
                                productQuantityAllowed =
                                  cartItem.total_stock -
                                    localCartItems[localCartItemIndex]
                                      ?.quantity || cartItem.total_stock;
                              }

                              if (productQuantityAllowed <= 0) {
                                toast.error(
                                  intl.formatMessage({
                                    id: `Maximum order quantity allowed now is `,
                                  })`${cartItem?.total_stock}`
                                );
                                return;
                              }
                              if (isLoggedIn) {
                                if (cartQuantity + 1 > cartItem?.total_stock) {
                                  toast.error(
                                    intl.formatMessage({
                                      id: `Maximum order quantity is`,
                                    })`${product?.total_stock}`
                                  );
                                } else {
                                  increaseQuantity(cartItem.id);
                                  setCartDataUpdated(!cartDataUpdated);
                                }
                              } else {
                                if (cartQuantity + 1 > cartItem.total_stock) {
                                  toast.error(
                                    intl.formatMessage({
                                      id: "Maximum order quantity is ",
                                    }) + `${cartItem.total_stock}`
                                  );
                                } else {
                                  increaseQuantity(product.id);
                                  setCartDataUpdated(!cartDataUpdated);
                                }
                              }
                            } else {
                              toast.error(
                                intl.formatMessage({
                                  id: "Maximum order quantity is ",
                                }) +
                                  ` ${
                                    product?.maximum_order_quantity ||
                                    product?.product?.maximum_order_quantity
                                  }`
                              );
                            }
                          }}
                          className="qty-up"
                        >
                          <i className="fi-rs-plus-small"></i>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="add"
                      style={{
                        border: "none",
                        backgroundColor: `${
                          product?.out_of_stock_status !== "in stock"
                            ? "grey"
                            : ""
                        }`,
                      }}
                      disabled={product?.out_of_stock_status !== "in stock"}
                      onClick={(e) => {
                        if (product?.out_of_stock_status === "in stock") {
                          handleCart(product);
                        } else {
                          toast.error(
                            intl.formatMessage({
                              id: "product is out of stock",
                            })
                          );
                        }
                      }}
                    >
                      <i className="fi-rs-shopping-cart mr-5"></i>{" "}
                      {product?.out_of_stock_status !== "in stock"
                        ? intl.formatMessage({ id: "Out of stock" })
                        : intl.formatMessage({ id: "Add" })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
  cartItems: state.cart,
});
const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  // fetchMoreProduct,
};
export default connect(mapStateToProps, mapDidpatchToProps)(Deals1);
// export default connect(null, mapDispatchToProps)(Deals1);
