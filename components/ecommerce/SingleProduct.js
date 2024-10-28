import Link from "next/link";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "sonner";
import { API_BASE_URL, api } from "../../lib/api";
import axios from "axios";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import { findProductIndexById } from "../../util/util";
import QuickView from "./QuickView";
import { useIntl } from "react-intl";
import storage from "../../util/localStorage";
import { translatedItemDetails } from "../../util/util";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { ApiCall } from "../../lib/other/other";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SingleProduct = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  openQuickView,
  cartItems,
  token,
}) => {
  const intl = useIntl();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartDataUpdated, setCartDataUpdated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

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
  }, [isLoggedIn, cartDataUpdated]);
  // console.log("cartitems====>", cartItems)
  const handleCart = async (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product, intl);
    // toast("Product added to Cart !");
  };
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

  const handleCompare = (product) => {
    addToCompare(product, intl);
    // toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product, intl);
    // toast("Added to Wishlist !");
  };
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const cartItem = cartItems?.find((item) => item?.id === product?.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  return (
    <>
      <div className="product-cart-wrap mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            {/* <Link
              href={`/${intl.locale === "eng" ? product?.seo_en : product?.seo_ja
                }`}
            >
              {Array.isArray(product?.image) &&
                product?.image?.map((itm, index) => {
                  return <img key={index} className="default-img" src={itm} alt="nest" />;
                })}
            </Link> */}
            <div data-slick='{"slidesToShow": 2, "slidesToScroll": 2}'>
              <Swiper
                slidesPerView={1}
                //loop={true}
                spaceBetween={0}
                modules={[Pagination]}
                effect={"fade"}
                fadeEffect={{
                  crossFade: true,
                }}
                pagination={{ clickable: true }}
              >
                {Array.isArray(product?.image) &&
                  product?.image?.map((itm, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img className="default-img" src={itm} alt="nest" />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
          <div className="product-action-1">
            <Link
              class="action-btn hover-up"
              aria-label="Quick view"
              href={`/${
                intl.locale === "eng" ? product?.seo_en : product?.seo_ja
              }`}
              as={`/${
                intl.locale === "eng" ? product?.seo_en : product?.seo_ja
              }`}
            >
              <i className="fi-rs-eye"></i>
            </Link>
            {/* <a
              aria-label="Quick view"
              className="action-btn hover-up"
              data-bs-toggle="modal"
              onClick={(e) => openQuickView(product)}
            >
              <i className="fi-rs-eye"></i>
            </a> */}
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
            {product?.badges?.map((Itm, index) => {
              return (
                <React.Fragment key={index}>
                  {Itm === "new" && <span className="new">New</span>}
                  {Itm === "hot" && <span className="hot">Hot</span>}
                  {Itm === "sale" && <span className="sale">Sale</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="product-content-wrap">
          {/* <div className="product-category">
            <Link
              href={`/${
                intl.locale === "eng"
                  ? product?.manufacturer?.seo_en
                  : product?.manufacturer?.seo_ja
              }`}
            >
              {product?.manufacturer?.name}
            </Link>
          </div> */}
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
          <div className="product-rate-cover-div">
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
          </div>

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
              {cartQuantity > 0 ? (
                <div className="detail-extralink mr-15">
                  <div className="detail-qty border radius d-flex align-items-center justify-content-between">
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
                          (cartQuantity ? cartQuantity : cartItem.quantity) <
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
                                localCartItems[localCartItemIndex]?.quantity ||
                              cartItem.total_stock;
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
                  className={`add ${
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
                    product?.out_of_stock_status !== "in stock" && !isLoggedIn
                  }
                  onClick={(e) => {
                    if (product?.out_of_stock_status === "in stock") {
                      handleCart(product);
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
                        intl.formatMessage({ id: "product is out of stock" })
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
              )}
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
  increaseQuantity,
  decreaseQuantity,
};

export default connect(null, mapDispatchToProps)(SingleProduct);
