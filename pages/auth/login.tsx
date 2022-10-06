import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material'
import NextLink from 'next/link'
import React, { useState, useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AuthLayout } from '../../components/layouts'
import { NextPage } from 'next';
import { validations } from '../../utils'
// import { tesloAPi } from '../../api'
// import axios from 'axios'
import { ErrorOutline } from '@mui/icons-material'
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';


type FormData = {
    email: string,
    password: string,
  };

const LoginPage:NextPage = () => {
    const { loginUser } = useContext(AuthContext)
    const { replace } = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setshowError] = useState(false)
    const onLoginUser: SubmitHandler<FormData> = async({email, password}) => { 
        setshowError(false)
        const isValidLogin = await loginUser(email, password)
        if (!isValidLogin) {
            setshowError(true)
            return
        }
        replace('/')
        
        // try {
        //     // TODO grabar user info en un context de auth
           
        //     // const { data } = await tesloAPi.post('/user/login', {email, password})
        //     // const { token , user } = data as {token:string, user:string}   
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         setshowError(true)
        //         // console.log(error.message)
        //     }
        // }
       
    };

    // console.log(watch("email")) // watch input value by passing the name of it
  return (
   <AuthLayout title='Ingresar'>
        <form onSubmit={handleSubmit(onLoginUser)} noValidate>
            <Box sx={{width: 350, padding:"10px 20px"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={'h1'} component={'h1'}>Iniciar sesión</Typography>
                        {showError && 
                          <Chip 
                            label={'No reconocemos el usuario / contraseña'}
                            color={'error'}
                            icon={<ErrorOutline />}
                            className='fadeIn'
                        />}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type={"email"}
                            label={'Correo electrónico'}
                            variant={'filled'}
                            fullWidth
                            {...register("email",  { 
                                required: "Este campo es obligatorio",
                                validate: (value) =>  validations.isEmail(value)
                            })}
                            error = {!!errors.email }
                            helperText={errors?.email?.message}
                            onFocus={() =>{
                                 return showError ? setshowError(false) : null                                   
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label={'Contraseña'}
                            variant={'filled'}
                            type={'password'}
                            fullWidth
                            {...register("password",  { 
                                required:  "Este campo es obligatorio",
                                minLength: {value: 5, message: "Minimo 5 caracteres"}
                            })}
                            error = {!!errors?.password }
                            helperText={errors?.password?.message}
                            onFocus={() =>{
                                return showError ? setshowError(false) : null                                   
                               }
                           }
                        />
                    </Grid>          
                    <Grid item xs={12}>
                        <Button type="submit" className='circular-btn' color={'secondary'} size={'large'} fullWidth>
                            Ingresar
                        </Button>              
                    </Grid>
                    <Grid item xs={12} display={'flex'} justifyContent={'end'}>
                        <NextLink href={'/auth/register'} passHref>
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>           
                    </Grid>
                </Grid>
            </Box>
        </form>
   </AuthLayout>
  )
}

export default LoginPage