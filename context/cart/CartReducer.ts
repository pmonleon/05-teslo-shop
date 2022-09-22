import { CartState } from "./";
import { ICartProduct } from "../../interfaces/cart";

type CartActionType =
  | {
      type: "[Cart] - Load cart from cookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[Cart] - Clean cart and cookies | storage";
    }
  | { type: "[Cart] - Add product"; payload: ICartProduct[] }
  | { type: "[Cart] - Update cart quantity"; payload: ICartProduct }
  | { type: "[Cart] - Remove product cart"; payload: ICartProduct }
  | { 
    type: "[Cart] - Update order summary"; 
    payload: {
        numberOfItems: number;
        subtotal: number;
        tax: number;
        total: number;
      }
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - Load cart from cookies | storage":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "[Cart] - Add product":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "[Cart] - Update cart quantity":
      return {
        ...state,
        cart: state.cart.map((item) => {
          // if (item._id !== action.payload._id) return item;
          // if (item.size !== action.payload.size) return item;
          return item._id === action.payload._id &&
            item.size === action.payload.size
            ? action.payload
            : item;
        }),
      };
    case "[Cart] - Remove product cart":
      return {
        ...state,
        cart: state.cart.filter(
          (item) =>
            item._id !== action.payload._id && item.size !== action.payload.size
        ),
      };

    case "[Cart] - Update order summary":
      return {
        ...state,
        ...action.payload
      };

    case "[Cart] - Clean cart and cookies | storage":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};