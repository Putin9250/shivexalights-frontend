import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((i) => i._id === action.payload._id && i.size === action.payload.size);
      if (item) {
        // Respect stock limit if provided
        const maxStock = action.payload.stock ?? Infinity;
        const newQty = item.quantity + action.payload.quantity;
        item.quantity = maxStock !== Infinity ? Math.min(newQty, maxStock) : newQty;
      } else {
        state.products.push(action.payload);
      }
    },
    updateQuantity: (state, action) => {
      // action.payload: { _id, size, quantity }
      const item = state.products.find(
        (i) => i._id === action.payload._id && i.size === action.payload.size
      );
      if (item) {
        const maxStock = item.stock ?? Infinity;
        const clamped = Math.max(1, Math.min(action.payload.quantity, maxStock === Infinity ? action.payload.quantity : maxStock));
        item.quantity = clamped;
      }
    },
    removeItem: (state, action) => {
      // action.payload can be _id string or { _id, size }
      if (typeof action.payload === "string") {
        state.products = state.products.filter((item) => item._id !== action.payload);
      } else {
        state.products = state.products.filter(
          (item) => !(item._id === action.payload._id && item.size === action.payload.size)
        );
      }
    },
    resetCart: (state) => {
      state.products = [];
    },
  },
});

export const { addToCart, removeItem, resetCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
