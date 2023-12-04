import React, { useEffect, useState } from "react";
import {
  clearCart,
  getCartItems,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../redux/action/cart";
import { connect } from "react-redux";
import Link from "next/link";
import { api } from "../lib/api";
import Layout from "../components/layout/Layout";
const OrderReceived = ({ cartItems }) => {
  const [userDetails, setUserDetails] = useState([]);
  const [address, setAddress] = useState("");

  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item?.price * item?.quantity));
    return price;
  };
  const getUserDetails = async (encodedToken) => {
    try {
      const response = await api.get("customer/info", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${encodedToken}`,
        },
      });
      setUserDetails(response?.data);
      console.log(response);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getAddress = async (encodedToken) => {
    const response = await api.get("customer/address/list", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${encodedToken}`,
      },
    });
    setAddress(response?.data);
  };
  console.log("userDetails", userDetails);
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    console.log("token", encodedToken);
    getUserDetails(encodedToken);
    getAddress(encodedToken);
  }, []);
  return (
    <Layout parent="Home" sub="Shop" subChild="Checkout">
      <section className="mt-50 mb-50">
        <div className="container">
          <div style={{ margin: "0 auto", fontFamily: "Montserrat" }}>
            <div style={{ pageBreakAfter: "always" }}>
              <h1>Order Received - Thank You!</h1>
              <h3>Order id #10760</h3>
              <p>
                Your order has been successfully received. Thank you for your
                purchase!
              </p>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td style={{ width: "50%" }}>
                      <b>Shipping Address</b>
                    </td>
                    <td style={{ width: "50%" }}>
                      <b>Contact</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {address?.billing_address?.[0]?.house}
                      <br />
                      {address?.billing_address?.[0]?.floor}{" "}
                      {address?.billing_address?.[0]?.road}
                      <br />
                      {address?.billing_address?.[0]?.address}
                    </td>
                    <td>
                      {userDetails?.email} <br />
                      {userDetails?.phone}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td className="text-left">Product</td>
                    {/* <td className="text-left">Model</td> */}
                    <td className="text-right">Quantity</td>
                    <td className="text-right">Unit Price</td>
                    <td className="text-right">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, i) => (
                    <tr>
                      <td class="text-left">
                        <Link href="/products">{item?.name}</Link>
                      </td>
                      {/* <td class="text-left">4005</td> */}
                      <td class="text-right"> {item?.quantity}</td>
                      <td class="text-right">¥{item?.price}</td>
                      <td class="text-right">
                        {" "}
                        ¥{(item?.quantity ? item?.quantity : 1) * item?.price}
                      </td>
                    </tr>
                  ))}

                  {/* <tr>
              <td colspan="4" class="text-right">
                Consumption Tax 8%
              </td>
              <td class="text-right">¥967</td>
            </tr> */}
                  <tr>
                    <td colspan="4" class="text-right">
                      Total
                    </td>
                    <td class="text-right">¥{price() + 600}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <td>
                      <b>Customer Comment</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Hello! Can you please send Soya sticks tomato flavour and
                      magic masala flavour as a free gift. Thank you!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  cartItems: state.cart,
});

const mapDispatchToProps = {
  closeCart,
  openCart,
  clearCart,
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderReceived);
