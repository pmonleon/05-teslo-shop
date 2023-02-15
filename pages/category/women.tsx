import React from 'react'
import Women from '../../components/category/Women'
import { ShopLayout } from '../../components/layouts'



const womenPage = () => {

    return (
      <ShopLayout
        title={'Teslo-Shop | Kids'}
        pageDescriptiom={'Encuentra los mejores productos para niños de Teslo aqui'}
        imageFullUrl={''}
      >
         <Women />
      </ShopLayout>
     
    )
}

export default womenPage