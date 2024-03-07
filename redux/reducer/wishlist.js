import * as Types from "../constants/actionTypes";
import { deleteProduct, findProductIndexById } from "../../util/util";
import storage from "../../util/localStorage";
import { toast } from "sonner";
import { useIntl } from "react-intl";

const initialState = {
  modal: false,
  items: [],
};

export default (state = initialState, action  ) => {
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
        toast(action?.payload?.lan == "jp" ?"製品はすでにウィッシュリストに追加されています":"Product already added to whishlist");
      } else {
        toast(action?.payload?.lan == "jp" ? "ウィッシュリストに追加されました!" : "Added to Wishlist !" );
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
