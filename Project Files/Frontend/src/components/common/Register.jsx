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
import Dropdown from 'react-bootstrap/Dropdown';

const Register = () => {
   const navigate = useNavigate()
   const [selectedOption, setSelectedOption] = useState('Select User');
   const [data, setData] = useState({
      name: "",
      email: "",
      password: "",
      type: "",
   })

   const handleSelect = (eventKey) => {
      setSelectedOption(eventKey);
      setData({ ...data, type: eventKey });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault()
      if (!data?.name || !data?.email || !data?.password || !data?.type) return alert("Please fill all fields");
      else {
         axiosInstance.post('/api/user/register', data)
            .then((response) => {
               if (response.data.success) {
                  alert(response.data.message)
                  navigate('/login')
               } else {
                  console.log(response.data.message)
               }
            })
            .catch((error) => {
               console.log("Error", error);
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
         <div className="auth-shell">
            <Box className="auth-card">
               <div className="auth-title">
                  <Avatar sx={{ bgcolor: '#14b8a6', margin: '0 auto' }}>LH</Avatar>
                  <Typography component="h1" variant="h5">Create account</Typography>
                  <p>Choose your role and start your LearnHub journey.</p>
               </div>
               <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField margin="normal" fullWidth id="name" label="Full Name" name="name" value={data.name} onChange={handleChange} autoComplete="name" autoFocus />
                  <TextField margin="normal" fullWidth id="email" label="Email Address" name="email" value={data.email} onChange={handleChange} autoComplete="email" />
                  <TextField margin="normal" fullWidth name="password" value={data.password} onChange={handleChange} label="Password" type="password" id="password" autoComplete="current-password" />
                  <Dropdown className='my-3'>
                     <Dropdown.Toggle className="btn-lh-outline w-100" id="dropdown-basic">
                        {selectedOption}
                     </Dropdown.Toggle>

                     <Dropdown.Menu className="w-100">
                        <Dropdown.Item onClick={() => handleSelect("Student")}>Student</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelect("Teacher")}>Teacher</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
                  <Box mt={2}>
                     <Button type="submit" variant="contained" className="btn-lh-primary" fullWidth sx={{ mt: 1, mb: 2, py: 1.2 }}>
                        Sign Up
                     </Button>
                  </Box>
                  <Grid container justifyContent="center">
                     <Grid item>
                        Already registered?
                        <Link style={{ color: "#2563eb", fontWeight: 700, marginLeft: 6 }} to={'/login'} variant="body2">
                           Sign in
                        </Link>
                     </Grid>
                  </Grid>
               </Box>
            </Box>
         </div>
      </>
   )
}
export default Register
