import React, { useContext, useState } from 'react'
import Header from '../pages/Header'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import axios from 'axios'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css';
import { Box, Button, Modal, Stack, TextField } from '@mui/material'
import { userInformation } from '../context/AuthContext'
import { Close } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'
import Footer from '../pages/Footer'
import './ProductDetail.css'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import NewFooter from '../pages/NewFooter'

const ProductDetail = () => {
  const { webuser } = useContext(userInformation)
  const { dispatch } = useContext(userInformation)
  const navigate = useNavigate()
  const { pid } = useParams()
  const [open, setOpen] = useState(false)
  const [signup, setSignup] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const { setCartCount } = useCart();
  const { register, handleSubmit } = useForm()
  const product = useFetch(`/product/getProductById/${pid}`)

  const addToCart = async (data) => {
    try {
      if (webuser) {
        const result = await axios.post(`/cart/addToCart/${webuser._id}`, data)
        //  navigate(`/cart/`, { state: { prod: data } })
        const res = await axios.get(`/cart/getCartItemCount/${webuser._id}`);

        setCartCount(res.data.count)

      } else {
        // setOpen(true)
        navigate('/signup')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const signUp = () => {
    try {
      setOpen(false)
      setSignup(true)
    } catch (error) {
      console.log(error);

    }
  }
  const registerUser = async (data) => {
    try {
    
      const result = await axios.post('/webuser/register', data)
      if (result.data.msg === 'User Created Successfully') {
        setOpen(false)
        setSignup(false)
        const cred = {
          email: data.email,
          password: data.password,
        }
        const res = await axios.post('/webuser/signup', cred)
      
        if (res.data.msg === 'Login Successfully') {
          dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.details })
          res.data.details ? navigate('/home') : alert(res.data.msg)
        } else {
          alert(res.data.msg)
        }
      } else {
        alert(result.data.msg)
      }


    } catch (error) {
      console.log(error);

    }
  }

  const loginUser = async () => {
    try {
    
      const cred = {
        email: email,
        password: password,
      }

      const result = await axios.post('/webuser/signup', cred)

      if (result.data.msg === 'Login Successfully') {

        dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.details })
        alert(result.data.msg)
        setOpen(false)
      }
      else {
        alert(result.data.msg)
      }
    } catch (error) {
      console.log(error);

    }
  }

  const buyNow = async (prdodData) => {
    try {
      if (webuser) {
        navigate(`/buynow/${prdodData._id}`)
      } else {
        // setOpen(true)
        navigate('/signup')
      }
    } catch (error) {
      console.log(error);
    }
  }

  let images = product.data?.images || [];
  if (product.data?.thumbnail && !images.includes(product.data.thumbnail)) {
    images = [product.data.thumbnail, ...images];
  }

  const items = images.map((item, index) => {
    const isVideo = item.endsWith('.mp4')

    return isVideo ? <video
      controls
      className="item"
      style={{
        height: "350px",
        width: "80%",
        objectFit: "cover",
        display: "block",
        margin: "20px auto",
        borderRadius: "10px"
      }}>
      <source src={axios.defaults.baseURL + item} type="video/mp4" />
    </video> :
      <img className="item"
        style={{
          height: "350px",
          width: "80%",
          objectFit: "cover",
          display: "block",
          margin: "20px auto",
          borderRadius: "10px"
        }}
        //  data-value={index + 1} 
        src={axios.defaults.baseURL + item}
      />;

  });
  return (
    <>
      <Header />
      <div className="product-detail-bg">
        <div className="product-detail-flex">
          <div className="product-card">
            <AliceCarousel
              autoHeight
              infinite
              mouseTracking
              items={items}
              disableButtonsControls={true}
            />

          </div>
          {product.data && (
            <div className="product-info">
              <div className="product-title">{product.data.title}</div>
              <div className="product-desc">{product.data.description}</div>
              {/* <div className="product-price">{product.data.selling_price} Rs.</div> */}
              <p>
                <span className="price-label">{product.data.actual_price} RS.</span>
                <span style={{ color: '#43a047', fontWeight: 'bold', fontSize: '1.3rem' }}>{product.data.selling_price} RS.</span>
                {product.data.discount > 0 && (
                  <span className="discount">{product.data.discount}% OFF</span>
                )}
              </p>
              <div className="product-actions">
                <Button
                  variant="contained"
                  className="product-btn"
                  onClick={() => addToCart(product.data)}
                >
                  <ShoppingBagOutlinedIcon style={{ marginRight: '8px' }} />
                  Add To Bag
                </Button>
                <Button
                  variant="contained"
                  className="product-btn"
                  onClick={() => buyNow(product.data)}
                >
                  <BoltOutlinedIcon style={{ marginRight: '8px' }} />
                  Buy Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Login Button */}
      <Modal open={open} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>

        <div >
          <Box sx={{ color: 'black', mt: '50%', p: '20px', border: '3px solid white', borderRadius: '20px', backgroundColor: 'white', justifyContent: 'center', alignContent: 'center' }}  >
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setOpen(false)}> <Close /> </Button>
            </div>
            <h1 style={{ color: '#471396' }}>Login</h1>
            {/* <form onSubmit={}> */}
            <Stack direction={'column'} spacing={2} style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>

              <TextField variant='standard' label='Email Address' name={'email'} onChange={(e) => setEmail(e.target.value)} sx={{ width: 300 }} />
              <TextField variant='standard' label='Password' type='password' name={'password'} onChange={(e) => setPassword(e.target.value)} sx={{ width: 300 }} />
              <Button variant='contained' sx={{ backgroundColor: '#471396', color: 'white' }} onClick={loginUser} >LOGIN</Button>
              <Button variant="text" sx={{ color: '#471396' }} onClick={() => signUp()}>Register For New User</Button>
            </Stack>

            {/* </form> */}
          </Box>
        </div>

      </Modal>

      {/* Register button */}
      <Modal open={signup} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>

        <div >
          <Box sx={{ color: 'black', mt: '35%', p: '20px', border: '3px solid white', borderRadius: '20px', backgroundColor: 'white', justifyContent: 'center', alignContent: 'center' }}  >
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setSignup(false)}> <Close /> </Button>
            </div>
            <h1 style={{ color: '#471396' }}>Register</h1>
            <form onSubmit={handleSubmit(registerUser)}>
              <Stack item direction={'column'} spacing={2} style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>

                <TextField variant='standard' label='User Name' name={'name'} {...register('name')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Email Address' name={'email'} {...register('email')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Mobile Number' name={'mob_no'} {...register('mob_no')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Address' name={'address'} {...register('address')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Pin Code' name={'pincode'} {...register('pincode')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Password' type='password' name={'password'} {...register('password')} sx={{ width: 300 }} />
                <Button variant='contained' sx={{ backgroundColor: '#471396', color: 'white' }} type='submit'>Register</Button>
              </Stack>

            </form>
          </Box>
        </div>

      </Modal>

      <NewFooter />
    </>
  )
}

export default ProductDetail