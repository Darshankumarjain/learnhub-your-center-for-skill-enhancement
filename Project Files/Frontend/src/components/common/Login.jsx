import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axiosInstance from './AxiosInstance';

const Login = () => {
   const navigate = useNavigate()
   const [data, setData] = useState({
      email: "",
      password: "",
   })
   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };
   const handleSubmit = (e) => {
      e.preventDefault();
      if (!data?.email || !data?.password) {
         return alert("Please fill all fields");
      } else {
         axiosInstance.post('/api/user/login', data)
            .then((res) => {
               if (res.data.success) {
                  alert(res.data.message)
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.userData));
                  navigate('/dashboard')
                  setTimeout(() => {
                     window.location.reload()
                  }, 1000)
               } else {
                  alert(res.data.message)
               }
            })
            .catch((err) => {
               if (err.response && err.response.status === 401) {
                  alert("User doesn't exist");
               }
               navigate("/login");
            });
      }
   };
   return (
      <>
         <Navbar expand="lg" className="learnhub-navbar">
            <Container fluid="xl">
               <Navbar.Brand className="brand-mark">
                  <span className="brand-icon">LH</span>
                  <span className="brand-text">LearnHub</span>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="navbarScroll" />
               <Navbar.Collapse id="navbarScroll">
                  <Nav className="ms-auto nav-links">
                     <Link to={'/'}>Home</Link>
                     <Link to={'/login'}>Login</Link>
                     <Link to={'/register'}>Register</Link>
                  </Nav>
               </Navbar.Collapse>
            </Container>
         </Navbar>
         <div className='auth-shell'>
            <Box className="auth-card">
               <div className="auth-title">
                  <Avatar sx={{ bgcolor: '#2563eb', margin: '0 auto' }}>LH</Avatar>
                  <Typography component="h1" variant="h5">Sign in</Typography>
                  <p>Continue learning from your LearnHub dashboard.</p>
               </div>
               <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                     margin="normal"
                     fullWidth
                     id="email"
                     label="Email Address"
                     name="email"
                     value={data.email}
                     onChange={handleChange}
                     autoComplete="email"
                     autoFocus
                  />
                  <TextField
                     margin="normal"
                     fullWidth
                     name="password"
                     value={data.password}
                     onChange={handleChange}
                     label="Password"
                     type="password"
                     id="password"
                     autoComplete="current-password"
                  />
                  <Box mt={2}>
                     <Button type="submit" variant="contained" className="btn-lh-primary" fullWidth sx={{ mt: 2, mb: 2, py: 1.2 }}>
                        Sign In
                     </Button>
                  </Box>
                  <Grid container justifyContent="center">
                     <Grid item>
                        New to LearnHub?
                        <Link style={{ color: "#2563eb", fontWeight: 700, marginLeft: 6 }} to={'/register'} variant="body2">
                           Create account
                        </Link>
                     </Grid>
                  </Grid>
               </Box>
            </Box>
         </div>
      </>
   )
}
export default Login
