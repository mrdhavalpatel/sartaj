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
  // const [cartItem, setCartItem] = useState([]);
  const [authToken, setAuthToken] = useState("");
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item?.price * item?.quantity));
    return price;
  };
  useEffect(() => {
    // let payload = {
    //   token: localStorage.getItem("token"),
    // };
    // getCartItems();
  }, []);
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
                    <a href="#" className="text-muted">
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
                  {cartItems.length <= 0 && "No Products"}
                  <table
                    className={
                      cartItems.length > 0 ? "table table-wishlist" : "d-none"
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
                      {cartItems.map((item, i) => (
                        <tr key={i}>
                          <td className="image product-thumbnail">
                            <img src={item?.image?.[0]} />
                          </td>
                          <td className="product-des product-name">
                            <h6 className="product-name">
                              <Link href="/products">{item?.name}</Link>
                            </h6>
                            <div className="product-rate-cover">
                              <div className="product-rate d-inline-block">
                                <div
                                  className="product-rating"
                                  style={{
                                    width: `${
                                      item?.overall_rating
                                        ? item?.overall_rating
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="font-small ml-5 text-muted">
                                {" "}
                                {`(${
                                  item?.total_reviews ? item.total_reviews : 0
                                })`}
                              </span>
                            </div>
                          </td>
                          <td className="price" data-title="Price">
                            <h4 className="text-brand">¥{item?.price}</h4>
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
                                      item?.quantity <=
                                      item?.maximum_order_quantity
                                    ) {
                                      increaseQuantity(item?.id);
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
                      <tr>
                        <td colSpan="6" className="text-end">
                          {cartItems.length > 0 && (
                            <a onClick={clearCart} className="text-muted">
                              <i className="fi-rs-cross-small"></i>
                              Clear Cart
                            </a>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="cart-action text-end">
                  <a className="btn " href="/shop-checkout">
                    <i className="fi-rs-shopping-bag mr-10"></i>
                    Continue Shopping
                  </a>
                </div>
                <div className="divider center_icon mt-50 mb-50">
                  <i className="fi-rs-fingerprint"></i>
                </div>
                <div className="row mb-50">
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
                                  ¥ {price()}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cart_total_label">Shipping</td>
                              <td className="cart_total_amount">
                                <i className="ti-gift mr-5"></i>
                                ¥600
                              </td>
                            </tr>
                            <tr>
                              <td className="cart_total_label">Total</td>
                              <td className="cart_total_amount">
                                <strong>
                                  <span className="font-xl fw-900 text-brand">
                                    ¥{price() + 600}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <a href="#" className="btn ">
                        <i className="fi-rs-box-alt mr-10"></i>
                        Proceed To CheckOut
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ) : (
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
                      <a href="#" className="text-muted">
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
                    {cartItem?.length <= 0 && "No Products"}
                    <table
                      className={
                        cartItem?.length > 0 ? "table table-wishlist" : "d-none"
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
                        {cartItem?.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img src={item?.product?.image?.[0]} />
                            </td>

                            <td className="product-des product-name">
                              <h6 className="product-name">
                                <Link href="/products">
                                  {item?.product?.name}
                                </Link>
                              </h6>
                              <div className="product-rate-cover">
                                <div className="product-rate d-inline-block">
                                  <div
                                    className="product-rating"
                                    style={{
                                      width: `¥{item?.product?.overall_rating}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="font-small ml-5 text-muted">
                                  {" "}
                                  {`(¥{item?.product?.total_reviews})`}
                                </span>
                              </div>
                            </td>
                            <td className="price" data-title="Price">
                              <h4 className="text-brand">¥{item.price}</h4>
                            </td>

                            <td
                              className="text-center detail-info"
                              data-title="Stock"
                            >
                              <div className="detail-extralink mr-15">
                                <div className="detail-qty border radius ">
                                  <a
                                    onClick={(e) => {
                                      // let qty = item.quantity - 1;
                                      // updateCart(item.id, qty);
                                      decreaseQuantity(item.id);
                                    }}
                                    className="qty-down"
                                  >
                                    <i className="fi-rs-angle-small-down"></i>
                                  </a>
                                  <span className="qty-val">
                                    {item.quantity}
                                  </span>
                                  <a
                                    onClick={(e) => {
                                      if (
                                        item.quantity <=
                                        item?.maximum_order_quantity
                                      ) {
                                        // let qty = item.quantity + 1;
                                        // updateCart(item.id, qty);
                                        increaseQuantity(item.id);
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
                                ¥{item.quantity * item.price}
                              </h4>
                            </td>
                            <td className="action" data-title="Remove">
                              <a
                                onClick={(e) => {
                                  deleteProductFromCart(item?.product?.id);
                                  deleteFromCart(item.id);
                                }}
                                className="text-muted"
                              >
                                <i className="fi-rs-trash"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="6" className="text-end">
                            {cartItems.length > 0 && (
                              <a onClick={clearCart} className="text-muted">
                                <i className="fi-rs-cross-small"></i>
                                Clear Cart
                              </a>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="cart-action text-end">
                    <a className="btn ">
                      <i className="fi-rs-shopping-bag mr-10"></i>
                      Continue Shopping
                    </a>
                  </div>
                  <div className="divider center_icon mt-50 mb-50">
                    <i className="fi-rs-fingerprint"></i>
                  </div>
                  <div className="row mb-50">
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
                                    ¥ {price()}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="cart_total_label">Shipping</td>
                                <td className="cart_total_amount">
                                  <i className="ti-gift mr-5"></i>
                                  Free Shipping
                                </td>
                              </tr>
                              <tr>
                                <td className="cart_total_label">Total</td>
                                <td className="cart_total_amount">
                                  <strong>
                                    <span className="font-xl fw-900 text-brand">
                                      ¥{price()}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <a href="#" className="btn ">
                          <i className="fi-rs-box-alt mr-10"></i>
                          Proceed To CheckOut
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}
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
