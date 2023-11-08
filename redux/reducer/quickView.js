import * as Types from "../constants/actionTypes";

export default (state = null, action) => {
  switch (action.type) {
    case Types.OPEN_QUICK_VIEW:
      return {
        ...action.payload.product,
      };

    case Types.CLOSE_QUICK_VIEW:
      return null;

    default:
      return state;
  }
};
