import { Box, Button, Stack, TextField, Card, CardContent, Typography, Avatar, Divider } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { userInformation } from '../context/AuthContext'
import axios from 'axios'
import useFetch from '../hooks/useFetch'

const Profile = () => {
  const { user } = useContext(userInformation)
  
  const [data, setData] = useState({
    username: '',
    mob_no: '',
    email: '',
    shop_name: '',
    shop_address: '',
    gst_no: '',
  })
  const [originalData, setOriginalData] = useState({})
  const [verify, setVerify] = useState({})
  const [disable,setDisable] = useState(true)
   const [password,setPassword] = useState({password:'',confirm_password:''})
  const record = useFetch(`/user/getUserById/${user._id}`)
  const userData = record.data
  useEffect(() => {
    setData({
      username: userData?.username,
      mob_no: userData?.mob_no,
      email: userData?.email,
      shop_name: userData?.shop_name,
      shop_address: userData?.shop_address,
      gst_no: userData?.gst_no,
    });

    setOriginalData({
      username: userData?.username,
      mob_no: userData?.mob_no,
      email: userData?.email,
      shop_name: userData?.shop_name,
      shop_address: userData?.shop_address,
      gst_no: userData?.gst_no,
    });
  }, [userData]);

  const isChange = JSON.stringify(data) !== JSON.stringify(originalData);

  const updateUser = async () => {
    try {
      const result = await axios.put(`/user/updateUser/${userData._id}`, data)
      if (result) {
        setData(result.data.data)
        record.refetch(`/user/getUserById/${user._id}`)
        alert(result.data.msg)
      }
    } catch (error) {}
  }

    const verifyPassword = async()=>{
    try {
        const resp = await axios.post(`/user/verifyPassword/${user.email}`,verify)
        alert(resp.data.msg)
        console.log(resp.data.msg)
        if(resp.data.msg === 'verified'){
            setDisable(false)
        }
    } catch (error) {
        console.log(error.response.data.message);
        setDisable(true)
    }
  }
  const updatePassword = async () => {
    try {
       if(password.password === '' || password.confirm_password === ''){
        alert("Please type Password")
    }else if(password.password === password.confirm_password){
       const resp = await axios.post(`/user/updatePassword/${user._id}`,password)
       setDisable(true)
       alert(resp?.data?.msg)
    }else{
        alert("Password not Match")
    }
    } catch (error) {
      console.log(error);  
    }
  }

  return (
    <Stack  direction={{ xs: 'column', sm: 'row' }}  >
    <Box>
      <Card sx={{ width: 420, borderRadius: 5, boxShadow: 6 }}>
        <CardContent>
          <Stack alignItems="center" spacing={2} mb={2}>
            {/* <Avatar sx={{ width: 72, height: 72, bgcolor: '#c26afc', fontSize: 32 }}>
              {data.username ? data.username[0]?.toUpperCase() : ''}
            </Avatar> */}
            <Typography variant="h5" fontWeight={600} color="#177bad">
              Profile
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack direction='column' spacing={3}>
            <TextField
              variant='outlined'
              label='Username'
              value={data?.username || ''}
              name='username'
              onChange={(e) => setData({ ...data, username: e.target.value })}
              fullWidth
            />
            <TextField
              variant='outlined'
              label='Email'
              type='email'
              value={data?.email || ''}
              name='email'
              onChange={(e) => setData({ ...data, email: e.target.value })}
              fullWidth
            />
            <TextField
              variant='outlined'
              label='Mobile Number'
              value={data?.mob_no || ''}
              name='mob_no'
              onChange={(e) => setData({ ...data, mob_no: e.target.value })}
              fullWidth
            />
            <TextField
              variant='outlined'
              label='Shop Name'
              value={data?.shop_name || ''}
              name='shop_name'
              onChange={(e) => setData({ ...data, shop_name: e.target.value })}
              fullWidth
            />
            <TextField
              variant='outlined'
              label='Shop Address'
              value={data?.shop_address || ''}
              name='shop_address'
              onChange={(e) => setData({ ...data, shop_address: e.target.value })}
              fullWidth
            />
            <TextField
              variant='outlined'
              label='GST Number'
              value={data?.gst_no || ''}
              name='gst_no'
              onChange={(e) => setData({ ...data, gst_no: e.target.value })}
              fullWidth
            />
            <Button
              variant='contained'
              sx={{
                background: 'linear-gradient(90deg, #c26afc 0%, #177bad 100%)',
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
                boxShadow: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #177bad 0%, #c26afc 100%)',
                },
              }}
              onClick={updateUser}
              disabled={!isChange}
              fullWidth
            >
              Update
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>

    <Box sx={{marginLeft: { xs: 0, sm: 2, lg:6 }, marginTop: { xs: 2, sm: 0 } }}>
    <Card sx={{ width: 420, borderRadius: 5, boxShadow: 6 }}>
        <CardContent>
            <Typography variant="h5" fontWeight={600} color="#177bad">
              Change Password
            </Typography>
          <Divider sx={{ mt: 2 }} />
          <Stack spacing={2} mt={2}>
            <TextField
              variant='outlined'
              label='Current Password'
              type='password'
              name='password'
              onChange={(e)=>setVerify({password:e.target.value})}
              fullWidth
            />
             <Button
              variant='contained'
              sx={{
                background: 'linear-gradient(90deg, #c26afc 0%, #177bad 100%)',
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
                boxShadow: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #177bad 0%, #c26afc 100%)',
                },
              }}
             onClick={() => verifyPassword()}
              fullWidth
            >
              Verify
            </Button>
            <TextField
              variant='outlined'
              label='New Password'
              type='password'
              name='password'
              onChange={(e) => setPassword({ ...password, password: e.target.value })}
              fullWidth
              disabled={disable}
            />
            <TextField
              variant='outlined'
              label='Confirm Password'
              type='password'
              onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
              name='password'
              fullWidth
              disabled={disable}
            />
            <Button
              variant='contained'
              sx={{
                background: 'linear-gradient(90deg, #c26afc 0%, #177bad 100%)',
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
                boxShadow: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #177bad 0%, #c26afc 100%)',
                },
              }}
              onClick={() => updatePassword()}
              disabled={disable}
              fullWidth
            >
              Update
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
    </Stack>
  )
}

export default Profile