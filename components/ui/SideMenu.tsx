import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ChaletOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { UiContext } from "../../context"
import { useContext, useState } from "react"
import { useRouter } from 'next/router';
import { ROUTES } from "../../constants/routes";
import { AuthContext } from '../../context/auth/AuthContext';
import { CartContext } from '../../context/cart/CartContext';
import { signOut } from 'next-auth/react';
import Cookies from "js-cookie";



export const SideMenu = () => {

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
    const { user, isLoggedIn, logoutUser  } = useContext(AuthContext)
    const { cleanCartAndStorage  } = useContext(CartContext)
    const { push,asPath } = useRouter()

    const [searchTerm, setsearchTerm] = useState('')

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url:string) => {    
        toggleSideMenu(false)  
        push(url)      
    }

    const onLogout = () => {
        toggleSideMenu(false)
        cleanCartAndStorage()
        Cookies.remove('token')
        logoutUser()
    }

    const onLogin = () => {
        navigateTo(`/auth/login?page=${asPath}`)
    }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        onClose={() => toggleSideMenu(false)}
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItemButton>
                    <Input
                        type='text'
                        placeholder="Buscar..."
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setsearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={onSearchTerm}
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItemButton>

            { isLoggedIn &&  (
                <>
               <ListItemButton>
                    <ListItemIcon>
                        <AccountCircleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Perfil'} />
                </ListItemButton>

                <ListItemButton  onClick = {() => navigateTo('/orders/history')}>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mis Ordenes'} />
                </ListItemButton>
                </>
                )}


                <ListItemButton  sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.men)} >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItemButton>

                <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.women)}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItemButton>

                <ListItemButton sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.kid)}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItemButton>


                {
                    isLoggedIn 
                    ? (

                        <ListItemButton onClick={onLogout}>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItemButton>

                    )
                    : (

                        <ListItemButton onClick={onLogin}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItemButton>
                    )
                }       

                {/* Admin */}
                <Divider />
            { !!user && user?.role.includes('admin')  && (
             <>
               <ListSubheader>Admin Panel</ListSubheader>
                <ListItemButton onClick = {() => navigateTo('/admin')}>
                    <ListItemIcon>
                        <ChaletOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Panel administración'} />
                </ListItemButton>
                <ListItemButton onClick = {() => navigateTo('/admin/products')}>
                    <ListItemIcon>
                        <CategoryOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Productos'} />
                </ListItemButton>
                
                <ListItemButton onClick = {() => navigateTo('/admin/orders')}>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ordenes'} />
                </ListItemButton>

                <ListItemButton onClick = {() => navigateTo('/admin/users')}>
                    <ListItemIcon>
                        <AdminPanelSettings/>
                    </ListItemIcon>
                    <ListItemText primary={'Usuarios'} />
                </ListItemButton>
                </>
                )}
            </List>
        </Box>
    </Drawer>
  )
}