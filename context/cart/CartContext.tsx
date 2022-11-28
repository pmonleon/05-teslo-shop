import { createContext } from 'react';
import { ICartProduct } from '../../interfaces';
import { ShippingAddress } from './CartProvider';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[] | [];
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    shippingAddres?: ShippingAddress
    // methods
   addProductToCart: (product:ICartProduct) => void;
   updateCartQuantity: (product:ICartProduct) => void;
   updateCartAddress: (address:ShippingAddress) => void;
   removeCartProduct: (product:ICartProduct) => void;
   cleanCartAndStorage: () => void;
   // orders
   createOrder: () => Promise<{hasError:boolean, message:string | undefined}>
}

export const CartContext = createContext({} as ContextProps);