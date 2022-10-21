import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { UiContext } from "../../context"
import { useContext, useState } from "react"
import { useRouter } from 'next/router';
import { ROUTES } from "../../constants/routes";
import { AuthContext } from '../../context/auth/AuthContext';
import { isValidToken } from '../../utils/jwt';



export const SideMenu = () => {

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
    const { user, isLoggedIn, logoutUser  } = useContext(AuthContext)
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

                <ListItem>
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
                </ListItem>

            { isLoggedIn &&  (
                <>
               <ListItem button>
                    <ListItemIcon>
                        <AccountCircleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Perfil'} />
                </ListItem>

                <ListItem button>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mis Ordenes'} />
                </ListItem>
                </>
                )}


                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.men)} >
                    <ListItemIcon>
                        <MaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Hombres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.women)}>
                    <ListItemIcon>
                        <FemaleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mujeres'} />
                </ListItem>

                <ListItem button sx={{ display: { xs: '', sm: 'none' } }} onClick={() => navigateTo(ROUTES.category.kid)}>
                    <ListItemIcon>
                        <EscalatorWarningOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Niños'} />
                </ListItem>


                {
                    isLoggedIn 
                    ? (

                        <ListItem button onClick={onLogout}>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>

                    )
                    : (

                        <ListItem button onClick={onLogin}>
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                }       

                {/* Admin */}
                <Divider />
            { !!user && user?.role.includes('admin')  && (
             <>
               <ListSubheader>Admin Panel</ListSubheader>

                <ListItem button>
                    <ListItemIcon>
                        <CategoryOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Productos'} />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ordenes'} />
                </ListItem>

                <ListItem button>
                    <ListItemIcon>
                        <AdminPanelSettings/>
                    </ListItemIcon>
                    <ListItemText primary={'Usuarios'} />
                </ListItem>
                </>
                )}
            </List>
        </Box>
    </Drawer>
  )
}