import axios from "axios";
import storage from "../../util/localStorage";
import { deleteProduct, findProductIndexById } from "../../util/util";
import * as Types from "../constants/actionTypes";
import { API_BASE_URL } from "../../lib/api";
import { toast } from "react-toastify";

export default (state = [], action) => {
  let index = null;
  let token = storage.get("token");

  switch (action.type) {
    case Types.INIT_LOCALSTORAGE:
      return [...action.payload.cart];
    case Types.GET_CART_ITEMS:
      if (token) {
        //customer/cart
        const response = axios
          .get(`${API_BASE_URL}customer/cart`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            return [
              ...action.payload.cartItemsData,
              ...response?.data?.cartProducts,
            ];
          })
          .catch((error) => {
            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
    case Types.ADD_TO_CART:
      index = findProductIndexById(state, action?.payload?.product?.id);

      if (index !== -1) {
        state[index].quantity += 1;
        if (token) {
          let payload = {
            product_id: action?.payload?.product?.id,
            quantity: state[index].quantity,
          };

          const response = axios
            .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              if (res?.data?.status == 200) {
                toast("Product added to Cart !");
              } else {
                toast.error(res?.data?.error);
              }
            })
            .catch((error) => {
              console.log("error", error?.code === "ERR_NETWORK");
            });
        }
        storage.set("dokani_cart", [...state]);

        return [...state];
      } else {
        if (!action?.payload?.product?.quantity) {
          action.payload.product.quantity = 1;
          if (token) {
            let payload = {
              product_id: action?.payload?.product?.id,
              quantity: 1,
            };
            const response = axios
              .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                if (res?.data?.status == 200) {
                  toast("Product added to Cart !");
                } else {
                  toast.error(res?.data?.error);
                }
              })
              .catch((error) => {
                console.log("error", error?.code === "ERR_NETWORK");
              });
          }
        } else {
          if (token) {
            let payload = {
              product_id: action?.payload?.product?.id,
              quantity: 1,
            };

            const response = axios
              .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                if (res?.data?.status == 200) {
                  toast("Product added to Cart !");
                } else {
                  toast.error(res?.data?.error);
                }
              })
              .catch((error) => {
                console.log("error", error?.code === "ERR_NETWORK");
              });
          }
        }
        storage.set("dokani_cart", [...state, action.payload.product]);

        return [...state, action.payload.product];
      }
    case Types.DELETE_FROM_CART:
      const newCartItems = deleteProduct(state, action.payload.productId);
      if (token) {
        const response = axios
          .delete(
            `${API_BASE_URL}customer/cart/remove-to-cart/${action.payload.productId}`,
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch((error) => {
            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
      storage.set("dokani_cart", newCartItems);

      return [...newCartItems];

    case Types.INCREASE_QUANTITY:
      index = findProductIndexById(state, action.payload.productId);
      if (index === -1) return state;
      state[index].quantity += 1;
      if (token) {
        let payload = {
          product_id: action.payload.productId,
          quantity: state[index].quantity,
        };
        const response = axios
          .put(`${API_BASE_URL}customer/cart/update-cart`, payload, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            console.log("error", error?.code === "ERR_NETWORK");
          });
        storage.set("dokani_cart", [...state]);

        return [...state];
      }

    case Types.DECREASE_QUANTITY:
      index = findProductIndexById(state, action.payload.productId);
      if (index === -1) return state;
      const quantity = state[index].quantity;
      if (quantity > 1) state[index].quantity -= 1;
      if (token) {
        let payload = {
          product_id: action.payload.productId,
          quantity: quantity > 1 ? state[index].quantity : 1,
        };
        const response = axios
          .put(`${API_BASE_URL}customer/cart/update-cart`, payload, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            console.log("error", error?.code === "ERR_NETWORK");
          });
      }

      storage.set("dokani_cart", [...state]);
      return [...state];

    case Types.CLEAR_CART:
      if (token) {
        const response = axios
          .delete(`${API_BASE_URL}customer/cart/clear-cart`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          .catch((error) => {
            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
      storage.set("dokani_cart", []);
      return [];

    default:
      return state;
  }
};
