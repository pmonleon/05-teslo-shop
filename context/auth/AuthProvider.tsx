
import axios from 'axios';
import Cookies from 'js-cookie';
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { tesloAPi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './'


interface Props {
    children:  ReactNode
}

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}


export const AuthProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

    useEffect(() => {
        if (!!Cookies.get('token')) {
            checkToken()
        }      
    }, [])


    const checkToken = async() => {
        try {
            const { data } = await tesloAPi.get('/user/validate-token')
          
            const {token , user} = data
           
            Cookies.set('token', token)
            dispatch({
                type:'Auth - Login',
                payload: user
             })
        } catch (error) {
            Cookies.remove('token')
            dispatch({
                type:'Auth - Logout'
            })
        }
    }

  const loginUser = async(email:string, password:string):Promise<boolean> => {
    
    try {
        const { data } = await tesloAPi.post('/user/login', {email, password})
        const {token , user} = data
        Cookies.set('token', token)
        dispatch({
            type:'Auth - Login',
            payload: user
         })
         return true
    } catch (error) {
        return false
    } 
  }

  const registerUser = async(name: string , email:string, password:string ):Promise<{hasError:boolean, message?:string}> => {
    
    try {
        const { data } = await tesloAPi.post('/user/register', { name, email, password })
        const {token , user} = data
        Cookies.set('token', token)
        dispatch({
            type:'Auth - Login',
            payload: user
         })
         return {
            hasError: false
         }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                hasError: true,
                // @ts-ignore
                message: error.response?.data.message
            }
        }
        return {
            hasError: true,
            message: 'No se pudo crear el usuario, intentelo mas tarde'
        }
    } 
  }

  return (
    <AuthContext.Provider
       value={{
           ...state,
           // methods
           loginUser,
           registerUser
       }}
     >
        { children }
    </AuthContext.Provider>
  )
}