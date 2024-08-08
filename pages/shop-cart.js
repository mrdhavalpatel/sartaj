import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { useIntl } from "react-intl";
import Link from "next/link";
import {
  clearCart,
  getCartItems,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";
import { useEffect } from "react";
import storage from "../util/localStorage";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { ErrorMessage, Field, Formik } from "formik";
import { Form, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";
import { findProductIndexById, translatedItemDetails } from "../util/util";
import { ApiCall } from "../lib/other/other";

const Cart = ({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
}) => {
  const intl = useIntl();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartDataUpdated, setCartDataUpdated] = useState(false);
  const [cartTotal, setCartTotal] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const checkoutUrl =
    intl.locale === "eng" ? "/shop-checkout" : "/jp/shop-checkout";
  const proceedToCheckout = () => {
    if (cartProducts?.length > 0) {
      return (
        <a href={checkoutUrl} className="btn cart_checkout_btn" aria-disabled>
          <i className="fi-rs-box-alt mr-10"></i>
          {intl.formatMessage({ id: "Proceed To CheckOut" })}
        </a>
      );
    } else {
      <a className="btn cart_checkout_btn" aria-disabled>
        <i className="fi-rs-box-alt mr-10"></i>
        {intl.formatMessage({ id: "Proceed To CheckOut" })}
      </a>;
    }
  };
  const addCurrenItems = (token) => {
    let FCart = cartProducts.map((item) => ({
      product_id: item?.id,
      qty: item?.quantity,
    }));

    let payload = {
      cart: FCart,
    };
    const response = axios
      .post(`${API_BASE_URL}customer/cart/add-items`, payload, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  const getCartData = (token) => {
    setLoading(true)
    const response = axios
      .get(`${API_BASE_URL}customer/cart/1`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          intl,
          "X-localization": intl.locale == "eng" ? "en" : "ja",
        },
      })
      .then((res) => {
        setCartProducts(res?.data?.cartProducts);
        setCartTotal(res?.data);
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)

        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required(
      intl.formatMessage({ id: "Username or Email is required" })
    ),
    currentpassword: Yup.string().required(
      intl.formatMessage({ id: "Password is required" })
    ),
  });
  const handleSubmit = (values) => {
    const payload = {
      email_or_phone: values?.usernameOrEmail,
      password: values?.currentpassword,
    };
    auth("post", "auth/login", payload).then((res) => {
      if (res?.response?.data?.errors) {
        toast.error(res?.response?.data?.errors?.[0]?.message);
      } else {
        console.log("token" , res.token)
        localStorage.setItem("token", res.token);
        addCurrenItems(res.token);
        setIsLoggedIn(true);
      }
    });
  };

  const handleClearCart = () => {
    setCartDataUpdated(!cartDataUpdated);
    clearCart();
    setCartProducts([]);
  };

  const getProductName = (item) => {
    if (item?.name) {
      return item.name;
    } else {
      if (intl.locale !== "eng" && item?.product?.translations?.length > 0) {
        const index = item?.product?.translations.findIndex(
          (translation) => translation.key === "name"
        );

        return item?.product?.translations[index].value;
      }
      return item?.product?.name;
    }
  };

  const updateProductDetails = async () => {
    const response = await ApiCall("post", intl, "products/all", {});
    //    console.log(await response.data.products.length);
  };

  useEffect(() => {
    let Token = storage.get("token");
    const fetchData = () => {
      console.log("token" , Token)
      if (Token) {
        getCartData(Token);
        setIsLoggedIn(Token);
      } else {
        if (intl.locale !== "eng") {
          updateProductDetails();
        }
        setCartProducts(cartItems);
      }
    };
    const timeoutId = setTimeout(fetchData, 700);
    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, cartDataUpdated]);
  return (
    <Layout parent="Home" sub="Shop" subChild="Cart">
      {/* {!isLoggedIn ? ( */}
      <section className="mt-50 mb-50">
        {isLoggedIn ? <div id="cart_top_row">
          <div className="container">
            <div className="cart_top_row">
              <div className="row align-items-center" >
                <div className="col-lg-4">
                  <h3 className="heading-2 mb-10">
                    {intl.formatMessage({ id: "Your Cart" })}
                  </h3>
                  <div className="d-flex d-md-block justify-content-between">
                    <h6 className="text-body">
                      {intl.formatMessage({
                        id: "Carefully check the information before checkout",
                      })}
                    </h6>
                  </div>
                </div>
                <div className="col-lg-4 col-4">
                  <div className="text-center">
                    {loading ? null : <h3 className="text-brand"> ¥
                      {cartTotal?.total_amt -
                        cartTotal.delivery_charge}</h3>}
                  </div>
                </div>
                <div className="col-lg-4 col-8">
                  <div className="text-end">
                    {proceedToCheckout()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : null}
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-40">
              {cartProducts.length <= 0 ? null : <h6 className="text-body text-md-end">
                <a
                  className="text-muted clearcarttext"
                  onClick={() => {
                    handleClearCart();
                  }}
                >
                  <i className="fi-rs-trash mr-5"></i>
                  {intl.formatMessage({ id: "Clear Cart" })}

                </a>
              </h6>}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div class="content-div">
                {loading ?
                  <div class="d-flex justify-content-center align-items-center ">
                    <Spinner animation="border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </Spinner>
                  </div> :
                  <div className="table-responsive shopping-summery">

                    {!loading && cartProducts.length <= 0 ?
                      <div className="emptyCart">
                        <img src="/assets/emptycart.png" alt="Empty Cart Image" />
                        <h5 className="mb-10">Cart's Feeling Light</h5>
                        <h6>Your cart awaits! Dive into your shopping adventure now and let the treasures find their way in!</h6>
                        <div className="cart-action  mobile_btn mt-40">
                          <a className="btn" href={`/${intl.locale}/shop`}>
                            <i className="fi-rs-arrow-left mr-10 " style={{ verticalAlign: "middle" }}></i>

                            {intl.formatMessage({ id: "Explore Sartaj" })}
                          </a>
                        </div>
                      </div> : null}
                    <div className={
                      cartProducts.length > 0 ? "mobile_cart_box" : "d-none"
                    }>
                      {cartProducts?.map((item, i) => (
                        <div className="mobile_cart_product_box" key={i}>
                          <div className="d-flex justify-content-between">
                            <img className="mobile_cart_product_box_img"
                              src={
                                item?.image?.[0]
                                  ? item?.image?.[0]
                                  : item?.product?.image?.[0]
                              }
                            />
                            <div className="mobile_cart_product_box_info">
                              <h6 className="mobile_cart_product_box_name">
                                <Link
                                  href={
                                    intl.locale == "eng"
                                      ? `${item?.seo_en
                                        ? item?.seo_en
                                        : item?.product?.seo_en
                                      }`
                                      : `${item?.seo_ja
                                        ? item?.seo_ja
                                        : item?.product?.seo_ja
                                      }`
                                  }
                                >
                                  {translatedItemDetails(
                                    "name",
                                    intl,
                                    item.product ? item.product : item
                                  )}
                                </Link>
                              </h6>
                              <p className="mobile_cart_product_box_price">{intl.formatMessage({ id: "Unit Price" })}
                                <span>¥
                                  {item?.actual_price
                                    ? item?.actual_price
                                    : item?.product?.actual_price
                                      ? item?.product?.actual_price
                                      : 0}
                                </span>
                              </p>
                            </div>
                            <div className="mobile_cart_product_box_qty">
                              <div className="detail-extralink">
                                <div className="detail-qty border radius d-sm-inline-flex d-flex align-items-center justify-content-between">
                                  <a
                                    onClick={() => {
                                      if (item?.quantity >= 1) {
                                        if (isLoggedIn) {
                                          decreaseQuantity(item?.product?.id);
                                          setCartDataUpdated(!cartDataUpdated);
                                        } else {
                                          decreaseQuantity(item?.id);
                                          setCartDataUpdated(!cartDataUpdated);
                                        }
                                      }
                                    }}
                                    className="qty-down"
                                  >
                                    <i className="fi-rs-minus-small"></i>
                                  </a>
                                  <span className="qty-val">{item?.quantity}</span>
                                  <a
                                    onClick={() => {
                                      if (
                                        (item?.quantity
                                          ? item?.quantity
                                          : item?.product?.product?.quantity) <
                                        (item?.maximum_order_quantity
                                          ? item?.maximum_order_quantity
                                          : item?.product?.maximum_order_quantity)
                                      ) {
                                        const localCartItems = JSON.parse(
                                          localStorage.getItem("dokani_cart")
                                        );
                                        let localCartItemIndex = -1;

                                        if (localCartItems) {
                                          localCartItemIndex = findProductIndexById(
                                            localCartItems,
                                            item?.product_id
                                          );
                                        }

                                        let productQuantityAllowed =
                                          item?.product?.total_stock;

                                        if (localCartItemIndex >= 0) {
                                          productQuantityAllowed =
                                            item?.product?.total_stock -
                                            localCartItems[localCartItemIndex]
                                              ?.quantity ||
                                            item?.product?.total_stock;
                                        }

                                        if (productQuantityAllowed <= 0) {
                                          toast.error(
                                            intl.formatMessage({
                                              id: `Maximum order quantity allowed now is `,
                                            })`${item?.product?.total_stock}`
                                          );
                                          return;
                                        }
                                        if (isLoggedIn) {
                                          if (
                                            item?.quantity + 1 >
                                            item?.product?.total_stock
                                          ) {
                                            // toast.error(
                                            //   `Maximum order quantity is ${item?.product?.total_stock}`
                                            // );
                                            toast.error(
                                              intl.formatMessage({
                                                id: `Maximum order quantity is`,
                                              })`${item?.product?.total_stock}`
                                            );
                                          } else {
                                            increaseQuantity(item?.product_id);
                                            setCartDataUpdated(!cartDataUpdated);
                                          }
                                        } else {
                                          if (
                                            item?.quantity + 1 >
                                            item?.total_stock
                                          ) {
                                            // toast.error(
                                            //   `Maximum order quantity is ${item?.total_stock}`
                                            // );
                                            toast.error(
                                              intl.formatMessage({
                                                id: "Maximum order quantity is ",
                                              }) + `${item?.total_stock}`
                                            );
                                          } else {
                                            increaseQuantity(item?.id);
                                            setCartDataUpdated(!cartDataUpdated);
                                          }
                                        }
                                      } else {
                                        // toast.error(
                                        //   `Maximum order quantity is ${
                                        //     item?.maximum_order_quantity
                                        //       ? item?.maximum_order_quantity
                                        //       : item?.product
                                        //           ?.maximum_order_quantity
                                        //   }`
                                        // );
                                        toast.error(
                                          intl.formatMessage({
                                            id: "Maximum order quantity is ",
                                          }) +
                                          ` ${item?.maximum_order_quantity ||
                                          item?.product?.maximum_order_quantity
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
                            </div>
                          </div>
                          <div className="mobile_cart_product_box_bottom">
                            <div className="d-flex justify-content-between">
                              <div className="mobile_cart_product_box_bottom_remove">
                                <a className="mobile_cart_product_box_bottom_remove_link"
                                  onClick={(_e) => {
                                    deleteFromCart(
                                      item?.product?.maximum_order_quantity
                                        ? item?.product?.id
                                        : item?.id
                                    );
                                    setTimeout(() => {
                                      setCartDataUpdated(!cartDataUpdated);
                                    }, 600);
                                  }}
                                >
                                  Remove
                                </a>
                              </div>
                              <div className="mobile_cart_product_box_bottom_price">
                                {intl.formatMessage({ id: "Sub Total" })}
                                <span>
                                  ¥
                                  {(item?.quantity ? item?.quantity : 1) *
                                    (item?.actual_price
                                      ? item?.actual_price
                                      : item?.product?.actual_price
                                        ? item?.product?.actual_price
                                        : 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <table
                      className={
                        cartProducts.length > 0 ? "table table-cart desktop_table" : "d-none"
                      }
                    >
                      <thead>
                        <tr className="main-heading">
                          <th className="custome-checkbox start pl-30" colSpan="2">
                            {intl.formatMessage({ id: "Product" })}
                          </th>
                          <th scope="col">
                            {intl.formatMessage({ id: "Unit Price" })}
                          </th>
                          <th scope="col">
                            {intl.formatMessage({ id: "Quantity" })}
                          </th>
                          <th scope="col">
                            {intl.formatMessage({ id: "Sub Total" })}
                          </th>
                          <th scope="col" className="end">
                            {intl.formatMessage({ id: "Remove" })}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartProducts?.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img
                                src={
                                  item?.image?.[0]
                                    ? item?.image?.[0]
                                    : item?.product?.image?.[0]
                                }
                              />
                            </td>
                            <td className="product-des product-name">
                              <h6 className="product-name">
                                <Link
                                  href={
                                    intl.locale == "eng"
                                      ? `${item?.seo_en
                                        ? item?.seo_en
                                        : item?.product?.seo_en
                                      }`
                                      : `${item?.seo_ja
                                        ? item?.seo_ja
                                        : item?.product?.seo_ja
                                      }`
                                  }
                                >
                                  {translatedItemDetails(
                                    "name",
                                    intl,
                                    item.product ? item.product : item
                                  )}
                                </Link>
                              </h6>
                              <div className="product-rate-cover">
                                <div className="product-rate d-inline-block">
                                  <div
                                    className="product-rating"
                                    style={{
                                      width: `${item?.overall_rating
                                        ? item?.overall_rating
                                        : item?.product?.overall_rating
                                          ? item?.product?.overall_rating
                                          : 0
                                        }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="font-small ml-5 text-muted">
                                  {" "}
                                  {`(${item?.total_reviews
                                    ? item.total_reviews
                                    : item?.product?.total_reviews
                                      ? item?.product?.total_reviews
                                      : 0
                                    })`}
                                </span>
                              </div>
                            </td>
                            <td data-title={intl.formatMessage({ id: "Unit Price" })}>
                              <h4 className="text-brand">
                                ¥
                                {item?.actual_price
                                  ? item?.actual_price
                                  : item?.product?.actual_price
                                    ? item?.product?.actual_price
                                    : 0}
                              </h4>
                            </td>
                            <td
                              className="text-center detail-info"
                              data-title={intl.formatMessage({ id: "Quantity" })}
                            >
                              <div className="detail-extralink">
                                <div className="detail-qty border radius d-sm-inline-flex d-flex align-items-center justify-content-between">
                                  <a
                                    onClick={() => {
                                      if (item?.quantity >= 1) {
                                        if (isLoggedIn) {
                                          decreaseQuantity(item?.product?.id);
                                          setCartDataUpdated(!cartDataUpdated);
                                        } else {
                                          decreaseQuantity(item?.id);
                                          setCartDataUpdated(!cartDataUpdated);
                                        }
                                      }
                                    }}
                                    className="qty-down"
                                  >
                                    <i className="fi-rs-minus-small"></i>
                                  </a>
                                  <span className="qty-val">{item?.quantity}</span>
                                  <a
                                    onClick={() => {
                                      if (
                                        (item?.quantity
                                          ? item?.quantity
                                          : item?.product?.product?.quantity) <
                                        (item?.maximum_order_quantity
                                          ? item?.maximum_order_quantity
                                          : item?.product?.maximum_order_quantity)
                                      ) {
                                        const localCartItems = JSON.parse(
                                          localStorage.getItem("dokani_cart")
                                        );
                                        let localCartItemIndex = -1;

                                        if (localCartItems) {
                                          localCartItemIndex = findProductIndexById(
                                            localCartItems,
                                            item?.product_id
                                          );
                                        }

                                        let productQuantityAllowed =
                                          item?.product?.total_stock;

                                        if (localCartItemIndex >= 0) {
                                          productQuantityAllowed =
                                            item?.product?.total_stock -
                                            localCartItems[localCartItemIndex]
                                              ?.quantity ||
                                            item?.product?.total_stock;
                                        }

                                        if (productQuantityAllowed <= 0) {
                                          toast.error(
                                            intl.formatMessage({
                                              id: `Maximum order quantity allowed now is `,
                                            })`${item?.product?.total_stock}`
                                          );
                                          return;
                                        }
                                        if (isLoggedIn) {
                                          if (
                                            item?.quantity + 1 >
                                            item?.product?.total_stock
                                          ) {
                                            // toast.error(
                                            //   `Maximum order quantity is ${item?.product?.total_stock}`
                                            // );
                                            toast.error(
                                              intl.formatMessage({
                                                id: `Maximum order quantity is`,
                                              })`${item?.product?.total_stock}`
                                            );
                                          } else {
                                            increaseQuantity(item?.product_id);
                                            setCartDataUpdated(!cartDataUpdated);
                                          }
                                        } else {
                                          if (
                                            item?.quantity + 1 >
                                            item?.total_stock
                                          ) {
                                            // toast.error(
                                            //   `Maximum order quantity is ${item?.total_stock}`
                                            // );
                                            toast.error(
                                              intl.formatMessage({
                                                id: "Maximum order quantity is ",
                                              }) + `${item?.total_stock}`
                                            );
                                          } else {
                                            increaseQuantity(item?.id);
                                            setCartDataUpdated(!cartDataUpdated);
                                          }
                                        }
                                      } else {
                                        // toast.error(
                                        //   `Maximum order quantity is ${
                                        //     item?.maximum_order_quantity
                                        //       ? item?.maximum_order_quantity
                                        //       : item?.product
                                        //           ?.maximum_order_quantity
                                        //   }`
                                        // );
                                        toast.error(
                                          intl.formatMessage({
                                            id: "Maximum order quantity is ",
                                          }) +
                                          ` ${item?.maximum_order_quantity ||
                                          item?.product?.maximum_order_quantity
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
                            </td>
                            <td className="text-right" data-title={intl.formatMessage({ id: "Sub Total" })}>
                              <h4 className="text-body">
                                ¥
                                {(item?.quantity ? item?.quantity : 1) *
                                  (item?.actual_price
                                    ? item?.actual_price
                                    : item?.product?.actual_price
                                      ? item?.product?.actual_price
                                      : 0)}
                              </h4>
                            </td>
                            <td className="action" data-title="Remove">
                              <a
                                onClick={(_e) => {
                                  deleteFromCart(
                                    item?.product?.maximum_order_quantity
                                      ? item?.product?.id
                                      : item?.id
                                  );
                                  setTimeout(() => {
                                    setCartDataUpdated(!cartDataUpdated);
                                  }, 600);
                                }}
                                className="text-muted"
                              >
                                <i className="fi-rs-trash"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>}
                {cartProducts.length <= 0 ? null : <div className="cart-action text-end mobile_btn">
                  <a className="btn cart_button_desktop" href={`/${intl.locale}/shop`}>
                    <i className="fi-rs-shopping-bag mr-10"></i>
                    {intl.formatMessage({ id: "Continue Shopping" })}
                  </a>
                </div>}
              </div>
            </div>
            {cartProducts.length > 0 ? (
              <div className="col-lg-4 col-md-12">
                <div className="carttotal_main_div sticky-div">
                  {isLoggedIn ? (
                    <div className="">
                      <div className="border p-md-4 p-30 border-radius cart-totals">
                        <div className="heading_s1 mb-3">
                          <h4>{intl.formatMessage({ id: "Cart Totals" })}</h4>
                        </div>
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td className="cart_total_label">
                                  {intl.formatMessage({
                                    id: "Cart Subtotal",
                                  })}
                                </td>
                                <td className="cart_total_amount">
                                  <span className="font-lg fw-900 text-brand">
                                    ¥{cartTotal?.total_sub_amt}
                                  </span>
                                </td>
                              </tr>
                              {cartTotal?.eight_percent ? (
                                <tr>
                                  <td className="cart_total_label">
                                    {intl.formatMessage({
                                      id: "Consumption Tax",
                                    })}{" "}
                                    8%
                                  </td>
                                  <td className="cart_total_amount">
                                    <span className="font-lg fw-900 text-brand">
                                      ¥{cartTotal?.eight_percent}
                                    </span>
                                  </td>
                                </tr>
                              ) : null}
                              {cartTotal?.ten_percent ? (
                                <tr>
                                  <td className="cart_total_label">
                                    {intl.formatMessage({
                                      id: "Consumption Tax",
                                    })}{" "}
                                    10%
                                  </td>
                                  <td className="cart_total_amount">
                                    <span className="font-lg fw-900 text-brand">
                                      ¥{cartTotal?.ten_percent}
                                    </span>
                                  </td>
                                </tr>
                              ) : null}

                              {/* <tr>
                                  <td className="cart_total_label">
                                    {intl.formatMessage({ id: "Shipping" })}
                                  </td>
                                  <td className="cart_total_amount">
                                    <i className="ti-gift mr-5"></i>¥
                                    {cartTotal?.delivery_charge}
                                  </td>
                                </tr> */}
                              <tr>
                                <td className="cart_total_label">
                                  {intl.formatMessage({ id: "Sub-Total" })}
                                </td>
                                <td className="cart_total_amount">
                                  <strong>
                                    <span className="font-xl fw-900 text-brand">
                                      ¥
                                      {cartTotal?.total_amt -
                                        cartTotal.delivery_charge}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="cart_total_label mb-3">
                            {intl.formatMessage({
                              id: "Shipping charges and delivery times vary based on the selected region during checkout for more information visit:",
                            })}
                            <a
                              href="/delivery_Information"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {intl.formatMessage({
                                id: " Delivery Information",
                              })}
                            </a>
                            .
                          </p>
                        </div>
                        {proceedToCheckout()}
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="login_wrap widget-taber-content background-white">
                              <div className="padding_eight_all bg-white">
                                <div className="heading_s1">
                                  <h1 className="mb-5">
                                    {intl.formatMessage({
                                      id: "Login for Checkout",
                                    })}{" "}
                                  </h1>
                                  <p className="mb-30">
                                    {intl.formatMessage({
                                      id: "Don't have an account?",
                                    })}{" "}
                                    <Link href="/register">
                                      {intl.formatMessage({
                                        id: "Create here",
                                      })}
                                    </Link>
                                  </p>
                                </div>
                                <Formik
                                  initialValues={{
                                    usernameOrEmail: "",
                                    currentpassword: "",
                                  }}
                                  validationSchema={validationSchema}
                                  onSubmit={async (
                                    values,
                                    { setSubmitting }
                                  ) => {
                                    // Prevent default form submission behavior
                                    setSubmitting(false);

                                    // Your custom submission logic goes here
                                    handleSubmit(values);

                                    // Optionally reset the form
                                    // resetForm();
                                  }}
                                >
                                  {({ isSubmitting, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                      <div className="form-group">
                                        <Field
                                          type="text"
                                          name="usernameOrEmail"
                                          placeholder={intl.formatMessage({
                                            id: "Username or Email *",
                                          })}
                                          className="form-control"
                                        />
                                        <ErrorMessage
                                          name="usernameOrEmail"
                                          component="div"
                                          style={{ color: "red" }}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <Field
                                          type="password"
                                          name="currentpassword"
                                          placeholder={intl.formatMessage({
                                            id: "Your password *",
                                          })}
                                          className="form-control"
                                        />
                                        <ErrorMessage
                                          name="currentpassword"
                                          component="div"
                                          style={{ color: "red" }}
                                        />
                                      </div>

                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          className="btn btn-heading btn-block hover-up"
                                          name="login"
                                          disabled={isSubmitting} // Disable the button while submitting
                                        >
                                          {intl.formatMessage({
                                            id: "Login",
                                          })}
                                        </button>
                                      </div>
                                    </Form>
                                  )}
                                </Formik>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="cart_button_mobile d-flex">
              {cartProducts.length <= 0 ? null :
                <>
                  {isLoggedIn ? (
                    <>
                      <div className="cart-action text-end mobile_btn">
                        <a className="btn" href={`/${intl.locale}/shop`}>
                          <i className="fi-rs-shopping-bag mr-10"></i>
                          {intl.formatMessage({ id: "Continue Shopping" })}
                        </a>
                      </div>
                      {proceedToCheckout()}
                    </>
                  ) : (
                    <div className="cart-action text-end mobile_btn onebtn">
                      <a className="btn" href={`/${intl.locale}/shop`}>
                        <i className="fi-rs-shopping-bag mr-10"></i>
                        {intl.formatMessage({ id: "Continue Shopping" })}
                      </a>
                    </div>
                  )}
                </>
              }
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  cartItemsData: state.cartItemsData,
  activeCart: state.counter,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  getCartItems,
  decreaseQuantity,
  deleteFromCart,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
