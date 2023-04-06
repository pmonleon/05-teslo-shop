import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import tesloApi from '../../../api/tesloApi';
import { Product } from '../../../models';
import { useRouter } from 'next/router';
import { tesloAPi } from '../../../api';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: "men" | "women" | "kid" | "unisex";
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const router = useRouter()
    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    })

    const [newTagValue, setNewTagValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      const subscription = watch((value,{name, type}) => {
       // console.log({value}, {name}, {type})
        if (name === 'title') {
            const newSlug = value.title?.trim()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .toLocaleLowerCase() || ''
            setValue('slug', newSlug)
        }
      })
    
      return () => {
        subscription.unsubscribe
      }
    }, [watch, setValue])
    

    const onSubmit = async( values: FormData ) => {
     
        if (values.images.length < 2) {
            return alert('minimo 2 imagenes')
        }

        setIsLoading(true)
        
        try {
            const {data} = await tesloApi({
                url: '/admin/products',
                method: !!values._id ? 'PUT' : 'POST',
                data: values
            })
            console.log({data})
            if (!values._id) {
                // TODO: recargar ordenador
                router.replace(`/admin/products/${values.slug}`)
                
            }
            
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }

        
    }

    const onDeleteTag = ( tag: string ) => {
        const currentTags= getValues('tags')
        setValue('tags', currentTags.filter(item => item !== tag), {shouldValidate:true})
        
    }

    const onCreateTag = ( event:KeyboardEvent<HTMLDivElement> ) => {
        const currentTags= getValues('tags')
        if (currentTags.includes(newTagValue)) {
            return
        }
        if(event.code === 'Space') setValue('tags', [...currentTags, newTagValue], { shouldValidate:true })
    }

    const onChangeSize = (size:string) => {
        const currentSizes = getValues('sizes')
        if (currentSizes.includes(size)) {
            return setValue('sizes', currentSizes.filter(item => item !== size), {shouldValidate:true})
        }else{
           return setValue('sizes', [...currentSizes, size], {shouldValidate:true}) 
        }
    }

    const onFilesSelected = async( {target}:ChangeEvent<HTMLInputElement> ) => {
        if(!target.files || target.files.length === 0 ){ return }

      //  console.log(target.files)
        
        try {
            for(const file of target.files){
                const formData = new FormData()
                formData.append('file', file)
              
                const {data} = await tesloAPi.post<{message:string}>('/admin/uploads', formData)
                setValue('images', [...getValues('images'), data.message],  { shouldValidate: true })
            }
        } catch (error) {
            console.log({error})
        }
    }


    const onDeleteImage = (img:string) => {
        setValue('images', getValues('images').filter(item => item !== img), {shouldValidate:true})
    }

    return (
        <AdminLayout 
            title={'Producto'} 
            subtitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isLoading}
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: "Este campo es obligatorio",
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: "Este campo es obligatorio",
                                minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: "Este campo es obligatorio",
                                minLength: { value: 0, message: 'Solo valores positivos o 0' }
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: "Este campo es obligatorio",
                                minLength: { value: 0, message: 'Solo valores positivos o 0' }
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ (event) => setValue('type', event.target.value, {shouldValidate: true}) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ (event) => setValue('gender', event.target.value as ("men" | "women" | "kid"), {shouldValidate: true}) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes(size) }/>} 
                                        label={ size } 
                                        onChange={() => onChangeSize(size)}
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: "Este campo es obligatorio",
                                minLength: { value: 3, message: 'minimo 3 caracteres' },
                                validate: (val) => { 
                                    return !val.trim().includes(' ') || 'Texto sin espacios en blanco' }
                                },
                            
                             )}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onKeyDown= {(e) => onCreateTag(e) }
                            onChange= {(e) => setNewTagValue(e.target.value.trim())}
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag:string) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={ () => fileInputRef.current?.click()
                                 }
                            >
                                Cargar imagen
                            </Button>
                            <input 
                                ref={ fileInputRef }
                                style={{display: 'none'}}
                                type="file" 
                                multiple
                                accept='image/png, image/gif, image/jpg, image/jpeg'
                                onChange={ onFilesSelected }
                            />
                            <Chip   
                                label="Es necesario al menos 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{
                                    display: getValues('images').length >= 2 ? 'none' : 'flex'
                                }}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( (img:string) => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage(img) }
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;

    let product:IProduct | null

    if (slug === 'new') {
       const temProduct:IProduct = JSON.parse(JSON.stringify(new Product()))
       delete temProduct._id
       temProduct.images = ['img1.jpg', 'img2.jpg']
       product = temProduct
    }else{
        product= await dbProducts.getProductBySlug(slug.toString());
    }
    
    if ( !product ) {
        return { 
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    
    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage