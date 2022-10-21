import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material'
import NextLink from 'next/link'
import React, { useState, useContext } from 'react'
import { AuthLayout } from '../../components/layouts'
import { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import tesloApi from '../../api/tesloApi';
import axios from 'axios';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';


type FormData = {
    name: string;
    email: string,
    password: string,
  };


const RegisterPage:NextPage = () => {
    const { registerUser } = useContext(AuthContext)
    const { replace, query} = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setshowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm:SubmitHandler<FormData> = async({name, email, password}) => {
    
        setshowError(false)
        const {hasError, message} = await registerUser(name, email, password)
        if ( hasError ) {
            !!message ? setErrorMessage(message) : null
            setshowError(true)
            return
        }
         !!query?.page ? replace(query.page.toLocaleString()) : replace('/')
        // try {
        //     const { data } = await tesloApi.post('/user/register', {name, email, password})
        //     const { token , user } = data as {token:string, user:string}
        //     // TODO grabar user inf
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         setshowError(true)
        //         // console.log(error.message)
        //     }
        // }
    }
   // console.log(watch("email"), watch("name"))
    return (
        <AuthLayout title='Registar'>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{width: 350, padding:"10px 20px"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                                <Typography variant={'h1'} component={'h1'}>Registrar</Typography>
                                {showError && 
                                <Chip 
                                    label={ errorMessage !== '' ? errorMessage : 'El usuario ya existe'}
                                    color={'error'}
                                    icon={<ErrorOutline />}
                                    className='fadeIn'
                                />}
                            </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label={'Nombre completo'}
                                variant={'filled'}
                                type={'text'}
                                fullWidth
                                {...register("name",  { 
                                    required: "Este campo es obligatorio",
                                    minLength :{value: 2, message: "Minimo 2 caracteres"}
                                })}
                                error = {!!errors.name }
                                helperText={errors?.name?.message}
                                onFocus={() =>{
                                     return showError ? setshowError(false) : null                                   
                                    }
                                }
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <TextField 
                                label={'Apellido'}
                                variant={'filled'}
                                type={'text'}
                                fullWidth
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <TextField 
                                label={'Correo electrónico'}
                                variant={'filled'}
                                type={'email'}
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
                            <Button  type="submit" className='circular-btn' color={'secondary'} size={'large'} fullWidth>
                                Registrar
                            </Button>              
                        </Grid>
                        <Grid item xs={12} display={'flex'} justifyContent={'end'}>
                            <NextLink href={ !!query?.page ? `/auth/login?page=${query.page.toLocaleString()}` : '/auth/login'} passHref>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>           
                        </Grid>
                    </Grid>
                </Box>
             </form>
        </AuthLayout>
       )
}

export default RegisterPage