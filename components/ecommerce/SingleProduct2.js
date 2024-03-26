import Link from "next/link";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "sonner";
import {
  addToCart, increaseQuantity,
  decreaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist } from "../../redux/action/wishlistAction";
import QuickView from "./QuickView";
import { useIntl } from "react-intl";
import { translatedItemDetails } from "../../util/util";
import { findProductIndexById } from "../../util/util";
import storage from "../../util/localStorage";
import { Swiper, SwiperSlide  } from "swiper/react";
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const SingleProduct2 = ({
  product,
  addToCart,
  addToCompare,
  addToWishlist,
  openQuickView,
  increaseQuantity,
  decreaseQuantity,
  cartItems

}) => {
  const intl = useIntl();
  const handleCart = (product) => {
    product = {
      ...product,
      quantity: 1,
    };
    addToCart(product, intl);
    // toast("Product added to Cart !");
  };

  const handleCompare = (product) => {
    addToCompare(product, intl);
    // toast("Added to Compare list !");
  };

  const handleWishlist = (product) => {
    addToWishlist(product, intl);
    // toast("Added to Wishlist !");
  };
  const cartItem = cartItems?.find(item => item?.id === product?.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
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
  // console.log("cart quantity===> single prouct 2" , cartQuantity)
  return (
    <>
      <div className="product-cart-wrap mb-30">
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            {/* <Link
              href={`/${intl.locale === "eng" ? product?.seo_en : product?.seo_ja
                }`}
            >
              <img className="default-img" src={product?.image} alt="nest" />
              <img className="hover-img" src={product?.image} alt="nest" />
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
             pagination={{clickable:true}}
           
            
         
            > 
        {Array.isArray(product?.image) &&
          product?.image?.map((itm, index) => {
            return (
              <SwiperSlide key={index}  >
                <img className="default-img" src={itm} alt="nest"  />
              </SwiperSlide>
            );
          })}
      </Swiper>
            </div>
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
            <Link
              href={`/${intl.locale === "eng" ? product?.seo_en : product?.seo_ja
                }`}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: translatedItemDetails("name", intl, product),
                }}
              />
            </Link>
          </h2>

          {product?.total_reviews > 0 ? (
            <div className="product-rate d-inline-block">
              <div
                className="product-rating"
                style={{
                  width: `${product?.overall_rating ? product.overall_rating : 0
                    }%`,
                }}
              ></div>
              <span className="font-small ml-5 text-muted">
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
                href={`/${intl.locale === "eng"
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
            {/* <div className="progress mb-5">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${((product?.sold_products || 0) /
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
            </span> */}
          </div>

          {/* <button
            className="add_to_cart_btn btn w-100 hover-up"
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
                toast.error( intl.formatMessage({ id:"product is out of stock"}));

              }
            }}
          >
            <i className="fi-rs-shopping-cart mr-5"></i>{" "}
            {product?.out_of_stock_status !== "in stock"
              ? intl.formatMessage({ id: "Out of stock" })
              : intl.formatMessage({ id: "Add to cart" })}{" "}
              
          </button> */}
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
                              ?.quantity ||
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
                          if (
                            cartQuantity + 1 >
                            cartItem?.total_stock
                          ) {
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
                          if (
                            cartQuantity + 1 >
                            cartItem.total_stock
                          ) {
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
                          ` ${product?.maximum_order_quantity ||
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
                className="add_to_cart_btn btn w-100 hover-up"
                style={{
                  border: "none",
                  backgroundColor: `${product?.out_of_stock_status !== "in stock" ? "grey" : ""
                    }`,
                }}
                disabled={product?.out_of_stock_status !== "in stock"}
                onClick={(e) => {
                  if (product?.out_of_stock_status == "in stock") {
                    handleCart(product);
                  } else {
                    toast.error(intl.formatMessage({ id: "product is out of stock" }));

                  }
                }}
              >
                <i className="fi-rs-shopping-cart mr-5"></i>{" "}
                {product?.out_of_stock_status !== "in stock"
                  ? intl.formatMessage({ id: "Out of stock" })
                  : intl.formatMessage({ id: "Add to cart" })}
              </button>
            )}
          </div>
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
  increaseQuantity,
  decreaseQuantity,
};

export default connect(null, mapDispatchToProps)(SingleProduct2);
