// import axios from "axios";
// import storage from "../../util/localStorage";
// import { deleteProduct, findProductIndexById } from "../../util/util";
// import * as Types from "../constants/actionTypes";
// import { API_BASE_URL } from "../../lib/api";
// import { toast } from "react-toastify";

// export default (state = [], action) => {
//   let index = null;
//   let token = storage.get("token");

//   switch (action.type) {
//     case Types.INIT_LOCALSTORAGE:
//       return [...action.payload.cart];
//     case Types.GET_CART_ITEMS:
//       if (token) {
//         //customer/cart
//         const response = axios
//           .get(`${API_BASE_URL}customer/cart`, {
//             headers: {
//               "Access-Control-Allow-Origin": "*",
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .then((response) => {
//             return [
//               ...action.payload.cartItemsData,
//               ...response?.data?.cartProducts,
//             ];
//           })
//           .catch((error) => {
////             console.log("error", error?.code === "ERR_NETWORK");
//           });
//       }
//     case Types.ADD_TO_CART:
//       index = findProductIndexById(state, action?.payload?.product?.id);
//       const localCartItems = JSON.parse(localStorage.getItem("dokani_cart"));
//       let localCartItemIndex = -1;
//       if (localCartItems) {
//         localCartItemIndex = findProductIndexById(
//           localCartItems,
//           action?.payload?.product?.id
//         );
//       }

//       let productQuantityAllowed = action?.payload?.product?.total_stock;

//       if (localCartItemIndex >= 0) {
//         productQuantityAllowed =
//           action?.payload?.product?.total_stock -
//             localCartItems[localCartItemIndex]?.quantity ||
//           action?.payload?.product?.total_stock;
//       }
////       console.log(productQuantityAllowed);
////       console.log(action?.payload?.product);

//       if (
//         productQuantityAllowed < action?.payload?.product?.quantity ||
//         localCartItems[localCartItemIndex]?.quantity +
//           action?.payload?.product?.quantity >
//           action?.payload?.product?.total_stock
//       ) {
//         if (productQuantityAllowed < 1) {
//           toast.error(
//             `Maximum order quantity is ${action?.payload?.product?.total_stock}`
//           );
//           return [...state];
//         }
//         toast.error(
//           `Maximum order quantity allowed now is ${productQuantityAllowed}`
//         );
//         return [...state];
//       }

//       if (productQuantityAllowed > 0) {
//         if (index !== -1) {
//           action?.payload?.product?.quantity
//             ? (state[index].quantity += action?.payload?.product?.quantity)
//             : (state[index].quantity += 1);

//           if (token) {
//             let payload = {
//               product_id: action?.payload?.product?.id,
//               quantity: state[index].quantity,
//             };

//             const response = axios
//               .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
//                 headers: {
//                   "Access-Control-Allow-Origin": "*",
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//               })
//               .then((res) => {
//                 if (res?.data?.status == 200) {
//                   toast("Product added to Cart !",{autoClose: 200,});
//                 } else {
//                   toast.error(res?.data?.error);
//                 }
//               })
//               .catch((error) => {
////                 console.log("error", error?.code === "ERR_NETWORK");
//               });
//           }

//           storage.set("dokani_cart", [...state]);

//           return [...state];
//         } else {
//           if (!action?.payload?.product?.quantity) {
//             action.payload.product.quantity = 1;
//             if (token) {
//               let payload = {
//                 product_id: action?.payload?.product?.id,
//                 quantity: 1,
//               };
//               const response = axios
//                 .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
//                   headers: {
//                     "Access-Control-Allow-Origin": "*",
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                   },
//                 })
//                 .then((res) => {
//                   if (res?.data?.status == 200) {
//                     toast("Product added to Cart !",{autoClose: 200,});
//                   } else {
//                     toast.error(res?.data?.error);
//                   }
//                 })
//                 .catch((error) => {
////                   console.log("error", error?.code === "ERR_NETWORK");
//                 });
//             }
//           } else {
//             if (token) {
//               let payload = {
//                 product_id: action?.payload?.product?.id,
//                 quantity: 1,
//               };

//               const response = axios
//                 .post(`${API_BASE_URL}customer/cart/add-to-cart`, payload, {
//                   headers: {
//                     "Access-Control-Allow-Origin": "*",
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                   },
//                 })
//                 .then((res) => {
//                   if (res?.data?.status == 200) {
//                     toast("Product added to Cart !",{autoClose: 200,});
//                   } else {
//                     toast.error(res?.data?.error);
//                   }
//                 })
//                 .catch((error) => {
////                   console.log("error", error?.code === "ERR_NETWORK");
//                 });
//             } else {
//               toast("Product added to Cart !",{autoClose: 200,});
//             }
//           }
//           storage.set("dokani_cart", [...state, action.payload.product]);

//           return [...state, action.payload.product];
//         }
//       }

//     case Types.DELETE_FROM_CART:
//       const newCartItems = deleteProduct(state, action.payload.productId);
//       if (token) {
//         const response = axios
//           .delete(
//             `${API_BASE_URL}customer/cart/remove-to-cart/${action.payload.productId}`,
//             {
//               headers: {
//                 "Access-Control-Allow-Origin": "*",
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//           .catch((error) => {
////             console.log("error", error?.code === "ERR_NETWORK");
//           });
//       }
//       storage.set("dokani_cart", newCartItems);

//       return [...newCartItems];

//     case Types.INCREASE_QUANTITY:
//       index = findProductIndexById(state, action.payload.productId);
//       if (index === -1) return state;
//       state[index].quantity += 1;
//       if (token) {
//         let payload = {
//           product_id: action.payload.productId,
//           quantity: state[index].quantity,
//         };
//         const response = axios
//           .put(`${API_BASE_URL}customer/cart/update-cart`, payload, {
//             headers: {
//               "Access-Control-Allow-Origin": "*",
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
////           .then((res) => console.log("response when add cart", res))
//           .catch((error) => {
////             console.log("error when", error);
////             console.log("error", error?.code === "ERR_NETWORK");
//           });
//       }
//       storage.set("dokani_cart", [...state]);
//       return [...state];

//     case Types.DECREASE_QUANTITY:
//       index = findProductIndexById(state, action.payload.productId);
//       if (index === -1) return state;
//       const quantity = state[index].quantity;
//       if (quantity > 1) state[index].quantity -= 1;
//       if (token) {
//         let payload = {
//           product_id: action.payload.productId,
//           quantity: quantity > 1 ? state[index].quantity : 1,
//         };
//         const response = axios
//           .put(`${API_BASE_URL}customer/cart/update-cart`, payload, {
//             headers: {
//               "Access-Control-Allow-Origin": "*",
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           .catch((error) => {
////             console.log("error", error?.code === "ERR_NETWORK");
//           });
//       }

//       storage.set("dokani_cart", [...state]);
//       return [...state];

//     case Types.CLEAR_CART:
//       if (token) {
//         const response = axios
//           .delete(`${API_BASE_URL}customer/cart/clear-cart`, {
//             headers: {
//               "Access-Control-Allow-Origin": "*",
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })

//           .catch((error) => {
////             console.log("error", error?.code === "ERR_NETWORK");
//           });
//       }
//       storage.set("dokani_cart", []);
//       return [];

//     default:
//       return state;
//   }
// };

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
//            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
    case Types.ADD_TO_CART:
      const lan =action?.payload?.intl?.locale
      index = findProductIndexById(state, action?.payload?.product?.id);
      const localCartItems = JSON.parse(localStorage.getItem("dokani_cart"));
      let localCartItemIndex = -1;
      if (localCartItems) {
        localCartItemIndex = findProductIndexById(
          localCartItems,
          action?.payload?.product?.id
        );
      }

      let productQuantityAllowed = action?.payload?.product
        ?.maximum_order_quantity
        ? action?.payload?.product?.maximum_order_quantity
        : action?.payload?.product?.total_stock;

      if (localCartItemIndex >= 0) {
        const localQuantity =
          localCartItems[localCartItemIndex]?.quantity +
          (action?.payload?.product?.quantity
            ? action?.payload?.product?.quantity
            : 1);

        productQuantityAllowed =
          (action?.payload?.product?.maximum_order_quantity
            ? action?.payload?.product?.maximum_order_quantity
            : action?.payload?.product?.total_stock) - localQuantity;

        if (!productQuantityAllowed) {
          productQuantityAllowed = action?.payload?.product
            ?.maximum_order_quantity
            ? action?.payload?.product?.maximum_order_quantity
            : action?.payload?.product?.total_stock;
        }
      }

      if (
        productQuantityAllowed <= 0 ||
        productQuantityAllowed < action?.payload?.product?.quantity ||
        (localCartItemIndex > 0 &&
          localCartItems[localCartItemIndex]?.quantity +
            action?.payload?.product?.quantity >
            (action?.payload?.product?.maximum_order_quantity
              ? action?.payload?.product?.maximum_order_quantity
              : action?.payload?.product?.total_stock))
      ) {
        if (productQuantityAllowed < 1) {
        toast.error(lan == "jp" ? `最大注文数量は ${
          action?.payload?.product?.maximum_order_quantity
            ? action?.payload?.product?.maximum_order_quantity
            : action?.payload?.product?.total_stock
        }`
        
        :
        `Maximum order quantity is ${
          action?.payload?.product?.maximum_order_quantity
            ? action?.payload?.product?.maximum_order_quantity
            : action?.payload?.product?.total_stock
        }`);

          // toast.error(
          //   `Maximum order quantity is ${
          //     action?.payload?.product?.maximum_order_quantity
          //       ? action?.payload?.product?.maximum_order_quantity
          //       : action?.payload?.product?.total_stock
          //   }`
          // );
          return [...state];
        }
        toast.error(lan == "jp" ?
          `現在許可されている最大注文数量は次のとおりです ${productQuantityAllowed}`:`Maximum order quantity allowed now is ${productQuantityAllowed}`
        );
        return [...state];
      }

      if (productQuantityAllowed > 0) {
        if (index !== -1) {
          action?.payload?.product?.quantity
            ? (state[index].quantity += action?.payload?.product?.quantity)
            : (state[index].quantity += 1);

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
        toast(lan == "jp" ?"製品がカートに追加されました!":"Product added to Cart !");

                  // toast("Product added to Cart !");
                } else {
                  toast.error(res?.data?.error);
                }
              })
              .catch((error) => {
//                console.log("error", error?.code === "ERR_NETWORK");
              });
          } else {
        toast(lan == "jp" ?"製品がカートに追加されました!":"Product added to Cart !");

            // toast("Product added to Cart !");
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
        toast(lan == "jp" ?"製品がカートに追加されました!":"Product added to Cart !");

                    // toast("Product added to Cart !");
                  } else {
                    toast.error(res?.data?.error);
                  }
                })
                .catch((error) => {
//                  console.log("error", error?.code === "ERR_NETWORK");
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
        toast(lan == "jp" ?"製品がカートに追加されました!":"Product added to Cart !");

                    // toast("Product added to Cart !");
                  } else {
                    toast.error(res?.data?.error);
                  }
                })
                .catch((error) => {
//                  console.log("error", error?.code === "ERR_NETWORK");
                });
            } else {
        toast(lan == "jp" ?"製品がカートに追加されました!":"Product added to Cart !");

              // toast("Product added to Cart !");
            }
          }
          storage.set("dokani_cart", [...state, action.payload.product]);

          return [...state, action.payload.product];
        }
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
//            console.log("error", error?.code === "ERR_NETWORK");
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
//          .then((res) => console.log("response when add cart", res))
          .catch((error) => {
//            console.log("error when", error);
//            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
      storage.set("dokani_cart", [...state]);
      return [...state];

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
//            console.log("error", error?.code === "ERR_NETWORK");
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
//            console.log("error", error?.code === "ERR_NETWORK");
          });
      }
      storage.set("dokani_cart", []);
      return [];

    default:
      return state;
  }
};
