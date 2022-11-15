import { Box, Button, Grid, Link, TextField, Typography, Chip, Divider } from '@mui/material'
import NextLink from 'next/link'
import React, { useState, useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AuthLayout } from '../../components/layouts'
import { NextPage } from 'next';
import { validations } from '../../utils'
// import { tesloAPi } from '../../api'
// import axios from 'axios'
import { ErrorOutline } from '@mui/icons-material'
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'



type FormData = {
    email: string,
    password: string,
  };

const LoginPage:NextPage = () => {
    const { loginUser } = useContext(AuthContext)
    const { replace, query, asPath} = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setshowError] = useState(false)

    const [providers, setproviders] = useState<any>({})

    useEffect(() => {
    
    getProviders().then(prov => {
        console.log(prov)
        setproviders(prov)
    })
  
    }, [])
    

    useEffect(() => {  
      if(asPath.includes('error=CredentialsSignin')){
        setshowError(true)
      }
      return () => {
        if(showError) setshowError(false)
      }
    }, [])
    

    const onLoginUser: SubmitHandler<FormData> = async({email, password}) => { 
        setshowError(false)

        await signIn('credentials', { email, password })
            
        // const isValidLogin = await loginUser(email, password)
        // if (!isValidLogin) {
        //     setshowError(true)
        //     return
        // }
        // !!query?.page ? replace(query.page.toLocaleString()) : replace('/')
        
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
                        <NextLink href={ !!query?.page ? `/auth/register?page=${query.page?.toLocaleString()}` : '/auth/register'} passHref>
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>           
                    </Grid>

                    <Grid item xs={12} display={'flex'} flexDirection={'column'} justifyContent={'end'}>
                       <Divider sx={{width:'100%', mb:2}} />    
                       {
                            Object.values(providers).map((provider:any) => {
                                if (provider.id === 'credentials') {
                                    return <div key={provider.id}></div>
                                }
                                return (
                                    <Button
                                        key={provider.id}
                                        variant="outlined"
                                        fullWidth
                                        color='primary'
                                        sx={{mb:1}}
                                        onClick={() => signIn(provider.id) }
                                    >
                                        {provider.name}
                                    </Button>
                                )

                            })
                       } 
                    </Grid>

                </Grid>
            </Box>
        </form>
   </AuthLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req, res, query } = ctx

    // @ts-ignore
    const session = await unstable_getServerSession(req, res, authOptions)
    // const session = await getSession( req )

    const { page = '/' } = query

    if (session) {
        return {
            redirect: {
                destination: page.toString(),
                permanent: false
            }
         
        }
    }

    return {
        props: {
            
        }
    }
}


export default LoginPage