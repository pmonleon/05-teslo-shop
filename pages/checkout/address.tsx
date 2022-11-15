import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { GetServerSideProps, NextPage } from 'next';
import { countries, jwt } from '../../utils';
import { SubmitHandler, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/cart/CartContext';

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    zip: string;
    city: string;
    country:string;
    telephone:string
}

const initialData = {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: countries[0].code,
    telephone: ''
}

const getAddressFromCookies = ():FormData => {
    initialData.firstName = Cookies.get('firstName') || ''
    initialData.lastName = Cookies.get('lastName') || ''
    initialData.zip = Cookies.get('zip') || ''
    initialData.city = Cookies.get('city') || ''
    initialData.country = Cookies.get('country') || countries[0].code
    initialData.telephone = Cookies.get('telephone') || ''
    initialData.address = Cookies.get('address') || ''
    initialData.address2 = Cookies.get('address2') || ''
    return initialData
}

const AddressPage:NextPage = () => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });
    const { push } = useRouter()
    const { updateCartAddress, shippingAddres } = useContext(CartContext)
    const onSubmitAddress: SubmitHandler<FormData> = async(data) => { 
        updateCartAddress(data)
        push('/checkout/summary')
    }

    useEffect(() => {
     reset(getAddressFromCookies())
    }, [reset])
    
  
    return (
    <ShopLayout title='Dirección' pageDescriptiom='Confirmar dirección de destino'>
        <Typography variant={'h1'} component={'h1'} > 
            Dirección
        </Typography>
      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Grid container spacing={2} sx={{mt:2}}>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Nombre'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("firstName",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 2, message: "Minimo 2 caracteres"}
                    })}
                    error = {!!errors.firstName }
                    helperText={errors?.firstName?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Apellido'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("lastName",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 2, message: "Minimo 2 caracteres"}
                    })}
                    error = {!!errors.lastName }
                    helperText={errors?.lastName?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Dirección'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("address",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 5, message: "Minimo 5 caracteres"}
                    })}
                    error = {!!errors.address }
                    helperText={errors?.address?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Dirección 2 (opcional)'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("address2")}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Código postal'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("zip",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 4, message: "Minimo 4 caracteres"}
                    })}
                    error = {!!errors.zip }
                    helperText={errors?.zip?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    type={'text'}
                    label={'Ciudad'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("city",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 3, message: "Minimo 3 caracteres"}
                    })}
                    error = {!!errors.city }
                    helperText={errors?.city?.message}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                     {/* <InputLabel>País</InputLabel>    */}
                     <TextField  
                        select
                        variant={'filled'}
                        defaultValue={ !!shippingAddres?.country ? shippingAddres.country : countries[0].code}
                        label={'País'}
                        {...register("country",  { 
                            required: "Este campo es obligatorio",
                        })}
                        error = {!!errors.country }
                        helperText={errors?.country?.message}
                    >
                        {
                         countries.map( (country, index) => (
                             <MenuItem 
                             key={index}
                             value={country.code}>
                                {country.name}
                             </MenuItem>                       
                         ))
                        }
                    </TextField >
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    type={'tel'}
                    label={'Teléfono'} 
                    variant={'filled'} 
                    fullWidth
                    {...register("telephone",  { 
                        required: "Este campo es obligatorio",
                        minLength: {value: 6, message: "Minimo 6 caracteres"}
                    })}
                    error = {!!errors.telephone }
                    helperText={errors?.telephone?.message}
                />
            </Grid>
        </Grid>
        <Box sx={{mt:5}} display={'flex'} justifyContent={'center'}>
            <Button type='submit' color={'secondary'} className='circular-btn' size={'large'}>
                Revisar pedido
            </Button>
        </Box>
    </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req}) => {
   
    // const { token = '' } = req.cookies;
    // let isValidToken = false

    // try {
    //     await jwt.isValidToken(token)
    //     isValidToken = true
    // } catch (error) {
    //     isValidToken = false
    // }

    // if (!isValidToken) {

    //     return {
    //         redirect: {
    //             destination: ('/auth/login?page=/checkout/address'),
    //             permanent: false
    //         }
    //     }
    // }

    return {
        props: {
            
        }
    }
}

export default AddressPage