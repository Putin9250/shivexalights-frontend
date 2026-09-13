import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const getStockLimit = (stock) => {
  const parsedStock = Number(stock);
  return Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((i) => i._id === action.payload._id && i.size === action.payload.size);
      const maxStock = getStockLimit(action.payload.stock);

      // Do not add products with no available inventory.
      if (maxStock < 1) return;

      if (item) {
        // Refresh inventory on existing persisted cart items, then clamp the total.
        item.stock = maxStock;
        const requestedQuantity = Math.max(1, Number(action.payload.quantity) || 1);
        item.quantity = Math.min(item.quantity + requestedQuantity, maxStock);
      } else {
        const requestedQuantity = Math.max(1, Number(action.payload.quantity) || 1);
        state.products.push({
          ...action.payload,
          stock: maxStock,
          quantity: Math.min(requestedQuantity, maxStock),
        });
      }
    },
    updateQuantity: (state, action) => {
      // action.payload: { _id, size, quantity }
      const itemIndex = state.products.findIndex(
        (i) => i._id === action.payload._id && i.size === action.payload.size
      );
      const item = state.products[itemIndex];
      if (item) {
        const maxStock = getStockLimit(item.stock);
        if (maxStock < 1) {
          state.products.splice(itemIndex, 1);
          return;
        }
        item.quantity = Math.max(1, Math.min(Number(action.payload.quantity) || 1, maxStock));
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
