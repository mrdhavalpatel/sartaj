import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "sonner";
import { API_BASE_URL, api } from "../../lib/api";
import axios from "axios";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import ProductTab from "../elements/ProductTab";
import RelatedSlider from "../sliders/Related";
import ThumbSlider from "../sliders/Thumb";
import RelatedSliderBySlug from "../sliders/RelatedSliderBySlug";
import { translatedItemDetails } from "../../util/util";
import storage from "../../util/localStorage";

const ProductDetails = ({
  intl,
  product,
  cartItems,
  addToCompare,
  addToCart,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  quickView,
  showReviewForm = false,
  setShowReviewForm = () => {},
  getProductDetailsBySlug = (product) => {},
}) => {
  //  // console.log(
  //   "data.........................................",
  //   quickView,
  //   intl.locale
  // );
  const [quantity, setQuantity] = useState(1);

  const handleCompare = (product) => {
    addToCompare(product, intl);
    // +toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product, intl);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let Token = storage.get("token");
    const fetchData = async () => {
      if (Token) {
        setIsLoggedIn(true);
        await getUserDetails(Token);
      } else {
        setIsLoggedIn(false);
        if (intl.locale !== "eng") {
        }
      }
    };
    const timeoutId = setTimeout(fetchData, 700);
    return () => clearTimeout(timeoutId);
  }, [isLoggedIn]);

  const [userid, setuserid] = useState();
  const getUserDetails = async (token) => {
    const response = await axios
      .get(`${API_BASE_URL}customer/info`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setuserid(response.data.id);
        // console.log("dvdvdv", response.data.id);
      })
      .catch((error) => {
        console.log("error fato", error);
        toast.error("An error occurred while processing your request.");
      });
  };

  const handleNotifyMe = async (product, userid) => {
    try {
      let Token = await storage.get("token");
      // console.log("gathiya ni", product, Token);
      const data = {
        product_id: product,
        user_id: userid,
      };
      const response = await axios.post(
        `${API_BASE_URL}customer/notifyme`,
        data,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      // setuserid(response.data.id);
      // console.log("dvdvdv ni not", response.data.id);
    } catch (error) {
      console.log("error fato ni not", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  return (
    <section className="mt-50 mb-50 product_section">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-xl-10 col-lg-12 m-auto">
            <div className="product-detail accordion-detail">
              <div className="row mb-50  mt-30">
                <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0">
                  <div className="detail-gallery">
                    {/* <span className="zoom-icon">
                      <i className="fi-rs-search"></i>
                    </span> */}

                    <div className="product-image-slider">
                      <ThumbSlider product={product} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 col-xs-12">
                  <div className="detail-info  pr-30 pl-30">
                    <div
                      className="product-cart-wrap badgesmain"
                      style={{
                        width: "auto",
                        display: "inline-block",
                        border: "none",
                      }}
                    >
                      <div
                        className="product-badges"
                        style={{ display: "inline-flex" }}
                      >
                        {product?.badges?.map((Itm) => {
                          return (
                            <>
                              {Itm == "new" && <span className="new">New</span>}
                              {Itm == "hot" && <span className="hot">Hot</span>}
                              {Itm == "sale" && (
                                <span className="sale">Sale</span>
                              )}
                            </>
                          );
                        })}
                      </div>
                    </div>
                    {/* <h2
                      className="title-detail"
                      dangerouslySetInnerHTML={{ __html: product?.name }}
                    ></h2> */}
                    <h2
                      className="title-detail"
                      dangerouslySetInnerHTML={{
                        __html: translatedItemDetails("name", intl, product),
                      }}
                    ></h2>
                    <div className="product-detail-rating_div">
                      {product?.overall_rating > 0 ? (
                        <div className="product-detail-rating">
                          <div className="product-rate-cover text-end">
                            <div className="product-rate d-inline-block">
                              <div
                                className="product-rating"
                                style={{
                                  width: `${
                                    product?.overall_rating
                                      ? product?.overall_rating
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="font-small ml-5 text-muted">
                              {" "}
                              {`(${product?.total_reviews})`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        intl.formatMessage({ id: "No reviews available" })
                      )}
                    </div>
                    <div className="clearfix product-price-cover">
                      <div className="product-price primary-color float-left">
                        <div className="product-price">
                          <span className="current-price  text-brand">
                            ¥{product?.actual_price}{" "}
                          </span>
                          {product?.actual_price == product?.price ? null : (
                            <span className="old-price">
                              {product?.price && `¥ ${product?.price}`}
                            </span>
                          )}
                          (Without tax)
                        </div>
                        {product?.discount?.percentage == null ? (
                          <span></span>
                        ) : (
                          <span>
                            <span className="save-price font-md color3 ml-15">
                              {product?.discount?.percentage}% Off
                            </span>
                            <span className="old-price font-md ml-15">
                              {product.oldPrice
                                ? `¥ ${product?.oldPrice}`
                                : null}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="short-desc mb-30">
                      {/* <p className="font-lg"  dangerouslySetInnerHTML={{
                        __html: translatedItemDetails(
                          "description",
                          intl,
                          product
                        ),
                      }}>
                    
                      </p> */}
                    </div>
                    <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                    <div className="detail-extralink d-flex align-items-start">
                      <div className="detail-qty border radius d-flex align-items-center justify-content-between">
                        <a
                          onClick={(_e) => {
                            product.total_stock > quantity &&
                              setQuantity(quantity > 1 ? quantity - 1 : 1);
                          }}
                          className="qty-down"
                        >
                          <i className="fi-rs-minus-small"></i>
                        </a>
                        <span className="qty-val">{quantity}</span>
                        <a
                          onClick={() => {
                            product.total_stock > quantity &&
                              setQuantity(quantity + 1);
                          }}
                          className="qty-up"
                        >
                          <i className="fi-rs-plus-small"></i>
                        </a>
                      </div>

                      <div className="product-extra-link2">
                        <button
                          className={`button button-add-to-cart add ${
                            product?.out_of_stock_status !== "in stock"
                              ? isLoggedIn
                                ? "notify-me-class"
                                : "out-of-stock-class"
                              : "add-to-cart-class"
                          }`}
                          style={{
                            border: "none",
                          }}
                          disabled={
                            product?.out_of_stock_status !== "in stock" &&
                            !isLoggedIn
                          }
                          onClick={(e) => {
                            if (product?.out_of_stock_status === "in stock") {
                              let p = {
                                ...product,
                                quantity: quantity || 1,
                              };
                              addToCart(p, intl);
                            } else if (isLoggedIn) {
                              // Trigger the notify-me feature for logged-in users
                              toast.success(
                                intl.formatMessage({
                                  id: "You will be notified when the product is back in stock",
                                })
                              );
                              handleNotifyMe(product.id, userid);
                            } else {
                              toast.error(
                                intl.formatMessage({
                                  id: "product is out of stock",
                                })
                              );
                            }
                          }}
                        >
                          {product?.out_of_stock_status === "in stock" && (
                            <i className="fi-rs-shopping-cart mr-5"></i>
                          )}
                          {product?.out_of_stock_status !== "in stock"
                            ? isLoggedIn
                              ? intl.formatMessage({ id: "Notify me" })
                              : intl.formatMessage({ id: "Out of stock" })
                            : intl.formatMessage({ id: "Add" })}
                        </button>

                        {/* <button
                          disabled={product?.out_of_stock_status !== "in stock"}
                          onClick={(e) => {
                            let p = {
                              ...product,
                              quantity: quantity || 1,
                            };
                            addToCart(p, intl);
                          }}
                          style={{
                            backgroundColor: `${
                              product?.out_of_stock_status !== "in stock"
                                ? "grey"
                                : ""
                            }`,
                          }}
                          className="button button-add-to-cart"
                        >
                          {product?.out_of_stock_status !== "in stock"
                            ? intl.formatMessage({ id: "Out of stock" })
                            : intl.formatMessage({ id: "Add to cart" })}
                        </button> */}

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
                    </div>
                    <ul className="product-meta font-xs color-grey mt-50">
                      <li className="mb-5">
                        SKU:
                        <a href="#">{product?.sku ? product?.sku : "--"}</a>
                      </li>
                      <li className="mb-5">
                        {intl.formatMessage({ id: "Tags" })}:
                        <a href="#" rel="tag" className="me-1">
                          {product?.product_tag ? product?.product_tag : "--"}
                        </a>
                      </li>
                      <li>
                        {intl.formatMessage({ id: "Availability" })}:
                        <span className="in-stock text-success ml-5">
                          {product?.stock}{" "}
                          {product?.out_of_stock_status == "in stock"
                            ? intl.formatMessage({ id: "Items In Stock" })
                            : intl.formatMessage({ id: "Out of stock" })}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {quickView ? null : (
                <>
                  <ProductTab
                    id={product?.id}
                    product={product}
                    total_reviews={product?.total_reviews}
                    review={product?.active_reviews}
                    showReviewForm={showReviewForm}
                    setShowReviewForm={setShowReviewForm}
                    getProductDetailsBySlug={getProductDetailsBySlug}
                  />
                  {product?.related_products?.length > 0 ? (
                    <div className="row mt-60">
                      <div className="col-12">
                        <h3 className="section-title style-1 mb-30">
                          {intl.formatMessage({ id: "Related products" })}
                        </h3>
                      </div>
                      <div className="col-12">
                        <div className="row related-products position-relative">
                          <RelatedSliderBySlug
                            slug={
                              intl.locale === "eng"
                                ? product?.seo_en
                                : product?.seo_ja
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  addToCompare,
  addToWishlist,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
