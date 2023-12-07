import { connect } from "react-redux";
import Layout from "../components/layout/Layout";

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
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { useAuth } from "../components/context/AuthContext";
import * as Yup from "yup";
import { auth } from "../lib/auth/auth";

const Cart = ({
  openCart,
  cartItems,
  cartItemsData,
  getCartItems,
  activeCart,
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  clearCart,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartDataUpdated, setCartDataUpdated] = useState(false);
  const [cartTotal, setCartTotal] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item?.price * item?.quantity));
    return price;
  };
  const proceedToCheckout = () => {
    if (cartProducts?.length > 0) {
      return (
        <a href="/shop-checkout" className="btn" aria-disabled>
          <i className="fi-rs-box-alt mr-10"></i>
          Proceed To CheckOut
        </a>
      );
    } else {
      <a className="btn" aria-disabled>
        <i className="fi-rs-box-alt mr-10"></i>
        Proceed To CheckOut
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
    const response = axios
      .get(`${API_BASE_URL}customer/cart`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartProducts(res?.data?.cartProducts);
        setCartTotal(res?.data);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required("Username or Email is required"),
    currentpassword: Yup.string().required("Password is required"),
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
        localStorage.setItem("token", res.token);
        addCurrenItems(res.token);
        setIsLoggedIn(true);
        // router.push("/");
      }
    });
  };
  const handleClearCart = () => {
    setCartDataUpdated(!cartDataUpdated);
    setCartProducts([]);
  };
  useEffect(() => {
    let Token = storage.get("token");
    if (Token) {
      getCartData(Token);
      setIsLoggedIn(Token);
    } else {
      setCartProducts(cartItems);
    }
  }, [isLoggedIn, cartDataUpdated]);
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Cart">
        {/* {!isLoggedIn ? ( */}
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mb-40">
                <h1 className="heading-2 mb-10">Your Cart</h1>
                <div className="d-flex justify-content-between">
                  <h6 className="text-body">
                    Carefully check the information before checkout
                  </h6>
                  <h6 className="text-body">
                    <a
                      className="text-muted"
                      onClick={() => {
                        clearCart();
                        handleClearCart();
                      }}
                    >
                      <i className="fi-rs-trash mr-5"></i>
                      Clear Cart
                    </a>
                  </h6>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="table-responsive shopping-summery">
                  {cartProducts.length <= 0 && "No Products"}
                  <table
                    className={
                      cartProducts.length > 0
                        ? "table table-wishlist"
                        : "d-none"
                    }
                  >
                    <thead>
                      <tr className="main-heading">
                        <th
                          className="custome-checkbox start pl-30"
                          colSpan="2"
                        >
                          Product
                        </th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Subtotal</th>
                        <th scope="col" className="end">
                          Remove
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
                              <Link href="/products">
                                {item?.name ? item?.name : item?.product?.name}
                              </Link>
                            </h6>
                            <div className="product-rate-cover">
                              <div className="product-rate d-inline-block">
                                <div
                                  className="product-rating"
                                  style={{
                                    width: `${
                                      item?.overall_rating
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
                                {`(${
                                  item?.total_reviews
                                    ? item.total_reviews
                                    : item?.product?.total_reviews
                                    ? item?.product?.total_reviews
                                    : 0
                                })`}
                              </span>
                            </div>
                          </td>
                          <td className="price" data-title="Price">
                            <h4 className="text-brand">
                              ¥
                              {item?.price
                                ? item?.price
                                : item?.product?.price
                                ? item?.product?.price
                                : 0}
                            </h4>
                          </td>
                          <td
                            className="text-center detail-info"
                            data-title="Stock"
                          >
                            <div className="detail-extralink mr-15">
                              <div className="detail-qty border radius ">
                                <a
                                  onClick={(e) => {
                                    decreaseQuantity(item?.id);
                                  }}
                                  className="qty-down"
                                >
                                  <i className="fi-rs-angle-small-down"></i>
                                </a>
                                <span className="qty-val">
                                  {item?.quantity}
                                </span>
                                <a
                                  onClick={(e) => {
                                    if (
                                      item?.quantity <
                                      item?.maximum_order_quantity
                                    ) {
                                      increaseQuantity(item?.id);
                                    } else {
                                      toast.error(
                                        `Maximum order quantity is${item?.maximum_order_quantity}`
                                      );
                                    }
                                  }}
                                  className="qty-up"
                                >
                                  <i className="fi-rs-angle-small-up"></i>
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="text-right" data-title="Cart">
                            <h4 className="text-body">
                              ¥
                              {(item?.quantity ? item?.quantity : 1) *
                                item?.price}
                            </h4>
                          </td>
                          <td className="action" data-title="Remove">
                            <a
                              onClick={(e) => deleteFromCart(item?.id)}
                              className="text-muted"
                            >
                              <i className="fi-rs-trash"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                      {/* <tr>
                        <td colSpan="6" className="text-end">
                          {cartProducts.length > 0 && (
                            <a
                              onClick={() => {
                                clearCart();
                                handleClearCart();
                              }}
                              className="text-muted"
                            >
                              <i className="fi-rs-cross-small"></i>
                              Clear Cart
                            </a>
                          )}
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                <div className="cart-action text-end">
                  <a className="btn " href="/shop-fullwidth">
                    <i className="fi-rs-shopping-bag mr-10"></i>
                    Continue Shopping
                  </a>
                </div>
                <div className="divider center_icon mt-50 mb-50">
                  <i className="fi-rs-fingerprint"></i>
                </div>
                <div className="row mb-50">
                  {isLoggedIn ? (
                    <div className="col-lg-6 col-md-12">
                      <div className="border p-md-4 p-30 border-radius cart-totals">
                        <div className="heading_s1 mb-3">
                          <h4>Cart Totals</h4>
                        </div>
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              <tr>
                                <td className="cart_total_label">
                                  Cart Subtotal
                                </td>
                                <td className="cart_total_amount">
                                  <span className="font-lg fw-900 text-brand">
                                    ¥ {cartTotal?.total_sub_amt}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="cart_total_label">Shipping</td>
                                <td className="cart_total_amount">
                                  <i className="ti-gift mr-5"></i>¥
                                  {cartTotal?.delivery_charge}
                                </td>
                              </tr>
                              <tr>
                                <td className="cart_total_label">Total</td>
                                <td className="cart_total_amount">
                                  <strong>
                                    <span className="font-xl fw-900 text-brand">
                                      ¥{cartTotal?.total_amt}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {proceedToCheckout()}
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                        <div className="row">
                          <div className="col-lg-6 pr-30 d-none d-lg-block">
                            <img
                              className="border-radius-15"
                              src="assets/imgs/page/login-1.png"
                              alt="nest"
                            />
                          </div>
                          <div className="col-lg-6 col-md-8">
                            <div className="login_wrap widget-taber-content background-white">
                              <div className="padding_eight_all bg-white">
                                <div className="heading_s1">
                                  <h1 className="mb-5">Login for Checkout </h1>
                                  <p className="mb-30">
                                    Don't have an account?{" "}
                                    <Link href="/page-register">
                                      Create here
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
                                    await handleSubmit(values);

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
                                          placeholder="Username or Email *"
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
                                          placeholder="Your password *"
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
                                          Log in
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
            </div>
          </div>
        </section>
      </Layout>
    </>
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
