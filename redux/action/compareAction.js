import { ApiCall } from "../../lib/other/other";
import * as Types from "../constants/actionTypes";

export const openCompareModal = (e) => (dispatch) => {
  dispatch({
    type: Types.OPEN_COMPARE,
  });
};

export const closeCompareModal = (e) => (dispatch) => {
  dispatch({
    type: Types.CLOSE_COMPARE,
  });
};

export const addToCompare = (product , intl) => (dispatch) => {
  dispatch({
    type: Types.ADD_TO_COMPARE,
    payload: { product ,intl },
  });
};

export const updateCompareProducts = (intl) => async (dispatch, state) => {
  try {
    const { compare } = state();

    const request = await ApiCall("post", intl, "products/all");
    const allProducts = await request?.data?.products;

    if (compare?.items.length > 0 && allProducts.length > 0) {
      let newCompareItems = [];

      compare.items.map((item) => {
        const product = allProducts.find((product) => product.id === item.id);

        if (product) {
          newCompareItems.push(product);
        }
      });

      dispatch({
        type: Types.UPDATE_COMPARE_PRODUCTS,
        payload: newCompareItems,
      });
    }
  } catch (error) {
    // console.log(error);
  }
};

export const deleteFromCompare = (productId) => (dispatch) => {
  dispatch({
    type: Types.DELETE_FROM_COMPARE,
    payload: { productId },
  });
};

export const clearCompare = () => (dispatch) => {
  dispatch({
    type: Types.CLEAR_COMPARE,
  });
};
