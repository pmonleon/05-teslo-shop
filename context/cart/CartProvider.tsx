
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';
import Cookie from 'js-cookie'; 


interface Props {
    children:  ReactNode
}

export interface CartState {
    cart: ICartProduct[] | [];
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0
}


export const CartProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

  useEffect(() => {
    if (state.cart.length === 0 ) {
      const cookieProducts = !!Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
      dispatch({
        type: '[Cart] - Load cart from cookies | storage',
        payload: cookieProducts
      }) 
    }        
  }, [])
  

  useEffect(() => {
    if(state.cart.length === 0) return
   Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    //@ts-ignore
    const numberOfItems:number =  state.cart.reduce((prev:number , current:ICartProduct) => current.quantity + prev, 0)
     //@ts-ignore
    const subtotal:number =  state.cart.reduce((prev:number , current:ICartProduct) => (current.quantity * current.price) + prev, 0)
    
    const taxRate:number = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) //(15%)
   
    const orderSummary = {
      numberOfItems,
      subtotal,
      tax: taxRate * subtotal,
      total: subtotal * (taxRate + 1)
    }
    dispatch({
      type: "[Cart] - Update order summary",
      payload: orderSummary
    })
  }, [state.cart])
  

  const addProductToCart = (product: ICartProduct) => {

    if (state.cart.some(item => item._id === product._id && item.size === product.size)) {
      const existProductInCart:ICartProduct[] = state.cart.filter(item => item._id === product._id && item.size === product.size)
       product.quantity = product.quantity + existProductInCart[0].quantity       
    }
    const productsCart:ICartProduct[] = state.cart.filter(item => (item._id !== product._id) || (item._id === product._id && item.size !== product.size))
    dispatch({
      type:"[Cart] - Add product",
      payload:[...productsCart, product]
    })
  }

  const updateCartQuantity = (product: ICartProduct) => {
      dispatch({
        type: "[Cart] - Update cart quantity",
        payload: product
      })
  }

  const removeCartProduct = (product: ICartProduct) => {
      dispatch({
        type: "[Cart] - Remove product cart",
        payload: product
      })
  }

  const cleanCartAndStorage = () => {
    Cookie.remove('cart')
    dispatch({
      type:"[Cart] - Clean cart and cookies | storage"
    })
  }

  return (
    <CartContext.Provider
       value={{
           ...state,
           // methods
           addProductToCart,
           updateCartQuantity,
           removeCartProduct,
           cleanCartAndStorage
       }}
     >
        { children }
    </CartContext.Provider>
  )
}