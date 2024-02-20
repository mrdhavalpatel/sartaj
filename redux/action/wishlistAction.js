import * as Types from '../constants/actionTypes'


export const openWishlistModal = e => dispatch => {
    dispatch({
        type: Types.OPEN_WISHLIST,
    })
}

export const closeWishlistModal = e => dispatch => {

    dispatch({
        type: Types.CLOSE_WISHLIST,
    })
}

export const addToWishlist =( product , intl) => dispatch => {
//    console.log("intl in wishlist===action" ,intl?.locale)
    const lan = intl?.locale
    dispatch({
        type: Types.ADD_TO_WISHLIST,
        payload: { product , lan},
      
    
    })
}


export const deleteFromWishlist = productId => dispatch => {
    dispatch({
        type: Types.DELETE_FROM_WISHLIST,
        payload: { productId }
    })
}

export const clearWishlist = () => dispatch => {
    dispatch({
        type: Types.CLEAR_WISHLIST,
    })
}
