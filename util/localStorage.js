// localstorage.js

class Storage {
  static set(key, cartItems) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
  }

  static get(key) {
    if (typeof window !== "undefined") {
      if (key === "token") {
        return localStorage.getItem("token");
      } else {
        return JSON.parse(localStorage.getItem(key));
      }
    }
    return null; // or handle appropriately if localStorage is not available
  }
}

export default Storage;
