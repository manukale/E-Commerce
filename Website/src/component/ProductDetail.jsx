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
console.log('cart::',data);

      if (webuser) {
        const result = await axios.post(`/cart/addToCart/${webuser._id}`, data)
        //  navigate(`/cart/`, { state: { prod: data } })
        const res = await axios.get(`/cart/getCartItemCount/${webuser._id}`);
        console.log('result:',result);
        console.log('res:',res);
        
        setCartCount(res.data.count)

      } else {
        setOpen(true)
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
      console.log('webData::', data);

      const result = await axios.post('/webuser/register', data)
      if (result.data.msg === 'User Created Successfully') {
        setOpen(false)
        setSignup(false)
        const cred = {
          email: data.email,
          password: data.password,
        }
        const res = await axios.post('/webuser/login', cred)
        console.log('res::', res);
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
      console.log('login::', email, password);

      const cred = {
        email: email,
        password: password,
      }

      const result = await axios.post('/webuser/login', cred)

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

const buyNow = async(prdodData) =>{
try {
    if (webuser) {
      navigate(`/buynow/${prdodData._id}`)
    }else{
      setOpen(true)
    }
} catch (error) {
  console.log(error); 
}
} 

  const items = product.data?.images.map((item, index) => {
    const isVideo = item.endsWith('.mp4')

    return isVideo ? <video
      controls
      className="item"
      style={{
        height: "300px",
        width: "50%",
        objectFit: "cover",
        display: "block",
        margin: "20px auto",
        borderRadius: "10px"
      }}>
      <source src={axios.defaults.baseURL + item} type="video/mp4" />
    </video> :
      <img className="item"
        style={{
          height: "300px",
          width: "50%",
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
      <div className='container'>

        <AliceCarousel
          autoHeight
          infinite
          mouseTracking
          items={items}
          disableButtonsControls={true}

        />
        {product.data && (

          <div style={{ marginLeft: '25%' }}>
            <h5>Title : {product.data.title}</h5>
            <h5> Description : {product.data.description}</h5>
            <h5>Price : {product.data.selling_price} Rs.</h5>
          </div>

        )}
        <div style={{ display: 'flex', justifyContent: 'ceneter', flexDirection: 'row', gap: '10px', marginLeft: '25%' }}>
          <Button variant='contained' sx={{ backgroundColor: '#c26afc' }} onClick={() => addToCart(product.data)}>Add To cart</Button>
          <Button variant='contained' sx={{ backgroundColor: '#c26afc' }} onClick={()=>buyNow(product.data)}>
            {/* <Link to={'/buynow'} style={{textDecoration:'none' ,color:'whitesmoke'}}>
            </Link> */}
            Buy Now
            </Button>
        </div>
      </div>

      {/* Login Button */}
      <Modal open={open} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>

        <div >
          <Box sx={{ color: 'black', mt: '50%', p: '20px', border: '3px solid white', borderRadius: '20px', backgroundColor: 'white', justifyContent: 'center', alignContent: 'center' }}  >
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setOpen(false)}> <Close /> </Button>
            </div>
            <h1 style={{ color: '#c26afc' }}>Login</h1>
            {/* <form onSubmit={}> */}
            <Stack direction={'column'} spacing={2} style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>

              <TextField variant='standard' label='Email Address' name={'email'} onChange={(e) => setEmail(e.target.value)} sx={{ width: 300 }} />
              <TextField variant='standard' label='Password' type='password' name={'password'} onChange={(e) => setPassword(e.target.value)} sx={{ width: 300 }} />
              <Button variant='contained' sx={{ backgroundColor: '#c26afc', color: 'white' }} onClick={loginUser} >LOGIN</Button>
              <Button variant="text" sx={{ color: '#c26afc' }} onClick={() => signUp()}>Register For New User</Button>
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
            <h1 style={{ color: '#c26afc' }}>Register</h1>
            <form onSubmit={handleSubmit(registerUser)}>
              <Stack item direction={'column'} spacing={2} style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>

                <TextField variant='standard' label='User Name' name={'name'} {...register('name')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Email Address' name={'email'} {...register('email')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Mobile Number' name={'mob_no'} {...register('mob_no')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Address' name={'address'} {...register('address')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Pin Code' name={'pincode'} {...register('pincode')} sx={{ width: 300 }} />
                <TextField variant='standard' label='Password' type='password' name={'password'} {...register('password')} sx={{ width: 300 }} />
                <Button variant='contained' sx={{ backgroundColor: '#c26afc', color: 'white' }} type='submit'>Register</Button>
              </Stack>

            </form>
          </Box>
        </div>

      </Modal>
    </>
  )
}

export default ProductDetail