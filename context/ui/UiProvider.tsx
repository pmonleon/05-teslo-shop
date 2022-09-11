
import { FC, ReactNode, useReducer } from 'react'
import { UiContext, uiReducer } from './'


interface Props {
    children:  ReactNode
}

export interface UiState {
    isMenuOpen: boolean
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false
}


export const UiProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

  const toggleSideMenu = (isOpen: boolean) => {
        dispatch({
            type: 'UI - toggleMenu',
            payload: isOpen
        })
  }

  return (
    <UiContext.Provider
       value={{
           ...state,
           // Methods
           toggleSideMenu
       }}
     >
        { children }
    </UiContext.Provider>
  )
}