import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[] | [];
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    // methods
   addProductToCart: (product:ICartProduct) => void;
   updateCartQuantity: (product:ICartProduct) => void;
   removeCartProduct: (product:ICartProduct) => void;
   cleanCartAndStorage: () => void;
}

export const CartContext = createContext({} as ContextProps);