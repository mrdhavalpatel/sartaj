import * as Types from "../constants/actionTypes";
import { deleteProduct, findProductIndexById } from "../../util/util";
import storage from "../../util/localStorage";
import { toast } from "react-toastify";

const initialState = {
  modal: false,
  items: [],
};

export default (state = initialState, action) => {
  let index = null;

  switch (action.type) {
    case Types.OPEN_WISHLIST:
      return {
        ...state,
        modal: true,
      };

    case Types.CLOSE_WISHLIST:
      return {
        ...state,
        modal: false,
      };

    case Types.INIT_LOCALSTORAGE:
      return {
        ...state,
        items: [...action.payload.wishlist],
      };

    case Types.ADD_TO_WISHLIST:
      index = findProductIndexById(state.items, action.payload.product.id);

      if (
        state.items.filter((item) => item.id === action.payload.product.id)
          .length > 0
      ) {
        toast("Product already added to whishlist");
      } else {
        toast("Added to Wishlist !");
      }
      if (index !== -1) return state;

      const items = [...state.items, action.payload.product];
      storage.set("dokani_wishlist", items);

      return {
        ...state,
        items,
      };

    case Types.DELETE_FROM_WISHLIST:
      const list = deleteProduct(state.items, action.payload.productId);
      storage.set("dokani_wishlist", list);

      return {
        ...state,
        items: [...list],
      };

    case Types.CLEAR_WISHLIST:
      storage.set("dokani_wishlist", []);

      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};
