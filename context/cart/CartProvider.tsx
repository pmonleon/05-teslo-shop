
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';
import Cookie from 'js-cookie'; 
import { tesloAPi } from '../../api';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';


interface Props {
    children:  ReactNode
}

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[] | [];
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    shippingAddres?: ShippingAddress,
    createdAt: string | Date
}

export interface ShippingAddress {
  
    firstName:string,
    lastName:string,
    address:string,
    address2:string,
    zip:string,
    city:string,
    country:string,
    telephone:string
  
}

const CART_INITIAL_STATE: CartState = {
    isLoaded:false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    shippingAddres: undefined,
    createdAt: ''
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

    if ( !!Cookie.get('firstName')) {
      
      const cookieAddress = {
        firstName : Cookie.get('firstName') || '',
        lastName : Cookie.get('lastName') || '',
        zip : Cookie.get('zip') || '',
        city : Cookie.get('city') || '',
        country : Cookie.get('country') || '',
        telephone : Cookie.get('telephone') || '',
        address : Cookie.get('address') || '',
        address2 : Cookie.get('address2') || '',
      }
      dispatch({
        type: '[Cart] - Load cart addres from cookies | storage',
        payload: cookieAddress
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
  const updateCartAddress = ( data:ShippingAddress) => {
        
      Cookie.set('firstName', data.firstName)
      Cookie.set('lastName', data.lastName)
      Cookie.set('zip', data.zip)
      Cookie.set('city', data.city)
      Cookie.set('country', data.country)
      Cookie.set('telephone', data.telephone)
      Cookie.set('address', data.address)
      Cookie.set('address2', data.address2 || '')
      dispatch({
        type: "[Cart] - Update cart address",
        payload: data
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
    Cookie.remove('firstName')
    Cookie.remove('lastName')
    Cookie.remove('zip')
    Cookie.remove('city')
    Cookie.remove('country')
    Cookie.remove('telephone')
    Cookie.remove('address') 
    Cookie.remove('address2')
    dispatch({
      type:"[Cart] - Clean cart and cookies | storage"
    })
  }

  const cleanCart = () => {
    Cookie.remove('cart')
    dispatch({
      type:'[Cart] - Cart complete'
    })
  }

  const createOrder = async():Promise<{hasError:boolean, message:string | undefined}> => {
    if (!state.shippingAddres) {
      throw new Error("No hay dirección de envío");     
    }
    
    const body: IOrder = {
      orderItems:state.cart.map((p) => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddres,
      numberOfItems: state.numberOfItems,
      subtotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }

    try {
      const { data } = await tesloAPi.post('/orders', body) 
      console.log({data})
      cleanCart()
      return {hasError:false, message:data.order._id}
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError:true,
          message: error.message 
        }
      }
      return {hasError:true, message:'se ha producido une error'}
    }
  }

  return (
    <CartContext.Provider
       value={{
           ...state,
           // methods
           addProductToCart,
           updateCartQuantity,
           updateCartAddress,
           removeCartProduct,
           cleanCartAndStorage,
           // order
           createOrder
       }}
     >
        { children }
    </CartContext.Provider>
  )
}