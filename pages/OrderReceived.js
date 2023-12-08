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
import { API_BASE_URL, api } from "../lib/api";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { ApiCall } from "../lib/other/other";
const OrderReceived = ({ cartItems }) => {
  const [userDetails, setUserDetails] = useState([]);
  const [address, setAddress] = useState("");
  const [cartItemsData, setCartItemsData] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage popup visibility

  const router = useRouter();
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (showConfirmation) {
        const confirmationMessage = "Are you sure you want to leave?";
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router.pathname, showConfirmation]);

  useEffect(() => {
    setShowConfirmation(true);
    let token = localStorage.getItem("token");
    const confirmationTimeout = setTimeout(() => {
      setShowConfirmation(false);

      const res = axios
        .delete(`${API_BASE_URL}customer/cart/clear-cart`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          localStorage.setItem("dokani_cart", "[]");
        });
    });

    return () => clearTimeout(confirmationTimeout);
  }, [router.pathname]);

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
  const getCartsItem = async (token) => {
    const response = await axios
      .get(`${API_BASE_URL}customer/cart`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCartItemsData(response?.data);
      })
      .catch((error) => {
        console.log("error", error?.code === "ERR_NETWORK");
      });
  };
  useEffect(() => {
    let encodedToken = localStorage.getItem("token");
    getCartsItem(encodedToken);
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
              {/* <h3>Order id #{}</h3> */}
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
                    <td className="text-left">Model</td>
                    <td className="text-right">Quantity</td>
                    <td className="text-right">Unit Price</td>
                    <td className="text-right">Total</td>
                  </tr>
                </thead>
                <tbody>
                  {cartItemsData?.cartProducts?.map((item, i) => (
                    <tr>
                      <td class="text-left">
                        <Link href="/products">{item?.product?.name}</Link>
                      </td>
                      <td class="text-left">{item?.product?.model}</td>
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
                      Sub Total
                    </td>
                    <td class="text-right">¥{cartItemsData?.total_sub_amt}</td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">
                      All Item in Dry Shipping:{" "}
                    </td>
                    <td class="text-right">
                      {" "}
                      ¥{cartItemsData?.delivery_charge}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">
                      Consumption Tax {cartItemsData?.eight_percent ? 8 : 0}%
                    </td>
                    <td class="text-right">
                      {" "}
                      ¥
                      {cartItemsData?.eight_percent
                        ? cartItemsData?.eight_percent
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" class="text-right">
                      Consumption Tax {cartItemsData?.ten_percent ? 10 : 0}%
                    </td>
                    <td class="text-right">
                      {" "}
                      ¥
                      {cartItemsData?.ten_percent
                        ? cartItemsData?.ten_percent
                        : 0}
                    </td>
                  </tr>

                  <tr>
                    <td colspan="4" class="text-right">
                      Total
                    </td>
                    <td class="text-right">¥{cartItemsData?.total_amt}</td>
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
