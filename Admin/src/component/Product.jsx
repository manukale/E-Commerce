import React, { useContext, useState } from 'react'
import { Autocomplete, Button, Card, CardContent, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import './product.css'
import axios from 'axios'
import useFetch from '../hooks/useFetch'
import { DataGrid } from '@mui/x-data-grid'

import { userInformation } from '../context/AuthContext'

const Product = () => {
  const { user } = useContext(userInformation)

  const category = useFetch('/category/getCategory')

  const [data, setData] = useState({
    title: '',
    description: '',
    actual_price: '',
    selling_price: '',
    // avail_qty: '',
    productBy: '',
    category: '',
    thumbnail: '',
    images: [],
  })

  const onSubmit = async () => {
    try {
       const actual = parseFloat(data.actual_price);
       const selling = parseFloat(data.selling_price);
       const discount = actual && selling ? Math.round(((actual - selling) / actual) * 100) : 0;
       console.log('Discount:', discount);
       data.discount = discount
      data.productBy = user?.shop_name
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('category', data.category)
      formData.append('productBy', data.productBy)
      formData.append('description', data.description)
      formData.append('actual_price', data.actual_price)
      formData.append('selling_price', data.selling_price)
      formData.append('discount', data.discount)
      // formData.append('avail_qty', data.avail_qty)
      formData.append('thumbnail', data.thumbnail)
      data.images?.forEach((images) => {
        formData.append('images', images)
      })
      const result = await axios.post('/product/addProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },

      })
      if (result.data.msg === 'Product Added') {
        alert(result.data.msg)
        // product.refetch('/product/getproduct')
        setData({
          title: '',
          category: '',
          description: '',
          actual_price: '',
          selling_price: '',
          // avail_qty: '',
        })
      }
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <Grid container
      justifyContent="center"
      alignItems="center"
      sx={{ width: '70vw' }} >
      <Grid item xs={12} md={10} lg={8}>
        <Card sx={{ borderRadius: 4, boxShadow: 10, background: 'white', mt: 5 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} color="#c26afc" gutterBottom>
              Product Upload
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField variant='outlined' label='Title' name={'title'} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} size='small' fullWidth />
                <TextField variant='outlined' label='MRP' name={'actual_price'} type='Number' value={data.actual_price} onChange={(e) => setData({ ...data, actual_price: e.target.value })} size='small' fullWidth />
                <TextField variant='outlined' label='Selling Price' name={'selling_price'} type='Number' value={data.selling_price} onChange={(e) => setData({ ...data, selling_price: e.target.value })} size='small' fullWidth />
                <Autocomplete
                  sx={{ minWidth: 160 }}
                  options={category.data || []}
                  getOptionLabel={(option) => option?.categoryName || ''}
                  onChange={(e, newValue) => setData({ ...data, category: newValue?.categoryName || '' })}
                  renderInput={(params) => <TextField {...params} name='category' label="Category" size="small" />}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField 
                variant='outlined' 
                label='Description' 
                name={'description'} 
                value={data.description} 
                onChange={(e) => setData({ ...data, description: e.target.value })} 
                size='small' 
                fullWidth 
                multiline 
                minRows={4} />

              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <label style={{ fontWeight: 500 }}>Select Thumbnail</label>
                <input type='file' name='thumbnail'
                  onChange={(e) => setData({ ...data, thumbnail: e.target.files[0] })} style={{ marginRight: 16 }} />
                <label style={{ fontWeight: 500 }}>Select Images</label>
                <input type='file' multiple name='images' onChange={(e) =>
                  setData({ ...data, images: Array.from(e.target.files) })
                } style={{ marginRight: 16 }} />
                <Button variant='contained' onClick={onSubmit} sx={{ background: 'linear-gradient(90deg, #c26afc 0%, #177bad 100%)', color: 'whitesmoke', fontWeight: 600 }}>
                  Add
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ my: 4 }} />
            {/* <Typography variant="h6" fontWeight={600} color="#177bad" gutterBottom>
              Product List
            </Typography>
            <div style={{ height: '400px', width: '100%' }}>
              {!product ? (
                <Typography variant="body1" color="text.secondary">L O A D I N G</Typography>
              ) : (
                <DataGrid
                  rows={product.data}
                  columns={prod_columns}
                  getRowId={row => row._id}
                  processRowUpdate={updateProduct}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    background: '#f9f9fb',
                  }}
                />
              )}
            </div> */}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Product