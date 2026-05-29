import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {

    toggleWishlist: (state, action) => {
      const index = state.products.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index >= 0) {
        // remove if already exists
        state.products.splice(index, 1);
      } else {
        // add if not present
        state.products.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },

    resetWishlist: (state) => {
      state.products = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, resetWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;