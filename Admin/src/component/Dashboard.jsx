import React, { useContext, useEffect, useState } from 'react'
import { Accordion, AccordionSummary, AppBar, Box, Button, Card, CardContent, Grid, Toolbar, Typography } from '@mui/material'
import Product from './Product';
import Category from './Category';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import { useNavigate } from 'react-router-dom';
import { userInformation } from '../context/AuthContext';

const selected = {
  display: 'flex',
  flexGrow: 1,
  color: "white",
  backgroundColor: " #c26afc",
  p: "5px",
  cursor: "pointer",
  height: '40px',
  justifyContent: 'start',
  borderRadius: "5px",
};
const unSelected = { color: ' #c26afc', p: "5px", cursor: "pointer" };

const Dashboard = () => {
  const { user, dispatch } = useContext(userInformation)
  const [comp, setComp] = useState()
  const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    })

  const logOut = () =>{
      dispatch({ type: 'LOGOUT' })
    navigate('/')
  }
  return (
    <>
      {/* <Header /> */}

      <Box sx={{ width: '100%' }}>
        <Box>
          <AppBar position='static'>
            <Toolbar sx={{ backgroundColor: '#c26afc' }}>
              <Typography variant='h5' component="div" sx={{ color: 'whitesmoke', flexGrow: 1 }}>
                {user.shop_name} Dashboard-Admin
              </Typography>
              <Button variant='text' style={{ color: 'whitesmoke' }} onClick={()=> logOut()}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Box>


        <Box sx={{ width: '100%', marginTop: '5px' }}>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid itemxs={2}>
              <Card sx={{ height: '100vh', width: '180px' }} >
                <CardContent>

                  <Accordion>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <Box display={'flex'} justifyContent={'center'} sx={comp === "Product" ? selected : unSelected} onClick={() => setComp('Product')}>
                          Upload Product
                        </Box>
                      </Typography>
                    </AccordionSummary>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <Box display={'flex'} justifyContent={'center'} sx={comp === 'Category'? selected : unSelected} onClick={()=> setComp('Category')} >
                          Add Category
                        </Box>
                      </Typography>
                    </AccordionSummary>
                  </Accordion>

                  {/* <Accordion>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <Box display={'flex'} justifyContent={'center'} sx={comp === 'About'? selected : unSelected} onClick={()=>setComp('About')}>
                          About Us
                        </Box>
                      </Typography>
                    </AccordionSummary>
                  </Accordion> */}

                  {/* <Accordion>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <Box display={'flex'} justifyContent={'center'} sx={comp === 'Contact' ? selected : unSelected} onClick={()=> setComp('Contact')}>
                          Contact Us
                        </Box>
                      </Typography>
                    </AccordionSummary>
                  </Accordion> */}
                  
                </CardContent>
              </Card>
            </Grid>

            <Grid item>
              <Box>
                <br />
                {
                  {
                    Product: <Product />,
                    Category: <Category />,
                    About: <AboutUs />,
                    Contact: <ContactUs />
                  }[comp]
                }
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default Dashboard

