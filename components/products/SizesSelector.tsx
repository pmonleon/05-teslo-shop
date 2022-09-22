import { Box, Button } from '@mui/material';
import React, { Dispatch, FC, SetStateAction } from 'react'
import { ISize } from '../../interfaces';
import { ICartProduct } from '../../interfaces/cart';

interface Props {
    selectedSize?: ISize;
    onSelectedSize: (size:ISize) => void;
    sizes: ISize[];
}

export const SizesSelector:FC<Props> = ({selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box>
        {
            sizes.map(size => (
                    <Button
                        key={size}
                        size='small'
                        color={selectedSize === size ? 'primary' : 'info'}
                        onClick={(e) => onSelectedSize( size ) }
                    >
                        {size}
                    </Button>
            ))
        }
    </Box>
  )
}
