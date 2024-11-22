// // localstorage.js

// class Storage {
//   static set(key, cartItems) {
//     if (typeof window !== "undefined") {
//       localStorage.setItem(key, JSON.stringify(cartItems));
//     }
//   }

//   static get(key) {
//     if (typeof window !== "undefined") {
//       if (key === "token") {
//         return localStorage.getItem("token");
//       } else {
//         return JSON.parse(localStorage.getItem(key));
//       }
//     }
//     return null; // or handle appropriately if localStorage is not available
//   }
// }

// export default Storage;


class Storage {
  static set(key, cartItems) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(cartItems));
    }
  }

  static get(key) {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (!item) return null; // Handle null or undefined directly
      if (key === "token") return item; // Return the token as-is

      try {
        return JSON.parse(item); // Safely parse JSON
      } catch (error) {
        console.error(`Error parsing JSON for key "${key}":`, error);
        return null; // Return null if parsing fails
      }
    }
    return null; // Return null if localStorage is unavailable
  }
}

export default Storage;
