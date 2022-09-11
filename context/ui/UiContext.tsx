import { createContext } from 'react';

interface ContextProps {
    isMenuOpen: boolean,
    // Methods
    toggleSideMenu: (isOpen:boolean) => void
}

export const UiContext = createContext({} as ContextProps);