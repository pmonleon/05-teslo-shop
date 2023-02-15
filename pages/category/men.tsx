import React from 'react'
import Men from '../../components/category/Men'
import { ShopLayout } from '../../components/layouts'


const menPage = () => {
  
    return (
      <ShopLayout
        title={'Teslo-Shop | Man'}
        pageDescriptiom={'Encuentra los mejores productos para hombres de Teslo aqui'}
        imageFullUrl={''}
      >
        <Men />
      </ShopLayout>
     
    )
}

export default menPage