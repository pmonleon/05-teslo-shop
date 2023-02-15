import { PeopleOutline } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DataGrid, GridColDef, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import tesloApi from '../../api/tesloApi';
import { NextPage } from 'next';



const UsersPage:NextPage = () => {

 
 const { data, error } = useSWR<{users:IUser[]}>('/api/admin/users') 
 const [users, setUsers] = useState<IUser[]>([])

 useEffect(() => {
   if (!!data) {
        setUsers(data.users)
   }
 }, [data])
 

 if (!data && !error) {
    return <></>
 }
 // console.log({data})
 const rows = users.map(user => ({
    id: user._id!,
    email: user.email,
    name: user.name,
    role: user.role
 }))

 const onSelectionChange = async(userId:string, role:"admin" | "client") => {
    const prevUsers = users.map(user =>( {...user}))
    const usersUpdated = users.map(user =>({
        ...user,
        role: user._id === userId ? [role] : user.role
    }))
    setUsers(usersUpdated)
    try {
        await tesloApi.put('admin/users', {userId, role} )
    } catch (error) {
        console.log({error})
        setUsers(prevUsers)
        alert('Hubo un error pruebelo más tarde')
    }

 }
 const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { 
        field: 'role', 
        headerName: 'Role', 
        width: 300,
        renderCell: ({row}:GridValueGetterParams) => {
            return (
                <> 
                    <Select 
                        value={row.role[0]}
                        label={'Role'}
                        onChange={({target}) => onSelectionChange(row.id, target.value)}  
                        sx={{
                            width:'300px'
                        }}          
                    >
                        <MenuItem value={'admin'}>Admin</MenuItem>
                        <MenuItem value={'client'}>Client</MenuItem>
                    </Select>
                </>
            )
        }
    }
 ]



  return (
    <AdminLayout
        title='Usuarios'
        subtitle='Listado de usuarios'
        icon={<PeopleOutline />}
    >
        
        <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width:'100%'}}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

    </AdminLayout>
  )
}

export default UsersPage