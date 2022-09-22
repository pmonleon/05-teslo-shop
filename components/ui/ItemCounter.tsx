import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  currentValue: number;
  onUpdatedQuantity: (quantity:number) => void
  maxValue: number;
}

export const ItemCounter:FC<Props> = ({currentValue, onUpdatedQuantity, maxValue}) => {
  return (
    <Box display={'flex'} alignItems={'center'}>
        <IconButton onClick={()=>{ currentValue > 1  &&  onUpdatedQuantity(-1)}}>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{width:40, textAlign:'center'}}>{currentValue}</Typography>
        <IconButton>
            <AddCircleOutline onClick={()=> currentValue < maxValue  && onUpdatedQuantity(+1)} />
        </IconButton>
    </Box>
  )
}
