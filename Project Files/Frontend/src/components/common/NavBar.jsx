import React, { useContext } from 'react'
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { UserContext } from '../../App';
import { NavLink } from 'react-router-dom';

const NavBar = ({ setSelectedComponent }) => {
   const user = useContext(UserContext)
   if (!user || !user.userData) {
      return null
   }
   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
   }
   const handleOptionClick = (component) => {
      if (setSelectedComponent) {
         setSelectedComponent(component);
      }
   };
   return (
      <Navbar expand="lg" className="learnhub-navbar">
         <Container fluid="xl">
            <Navbar.Brand className="brand-mark">
               <span className="brand-icon">LH</span>
               <span className="brand-text">LearnHub</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto nav-links">
                  <a href="/dashboard">Home</a>
                  {user.userData.type === 'Teacher' && (
                     <NavLink className="nav-link-action" onClick={() => handleOptionClick('addcourse')}>Add Course</NavLink>
                  )}
                  {user.userData.type === 'Admin' && (
                     <NavLink className="nav-link-action" onClick={() => handleOptionClick('cousres')}>Courses</NavLink>
                  )}
                  {user.userData.type === 'Student' && (
                     <NavLink className="nav-link-action" onClick={() => handleOptionClick('enrolledcourese')}>Enrolled Courses</NavLink>
                  )}
               </Nav>
               <Nav className="align-items-lg-center">
                  <p className='nav-user'>Hi {user.userData.name}</p>
                  <Button onClick={handleLogout} size='sm' variant='outline-danger'>Log Out</Button>
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   )
}
export default NavBar
