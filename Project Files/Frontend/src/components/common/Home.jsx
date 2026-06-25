import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';

const Home = () => {
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

         <section id='home-container' className='hero-section'>
            <div className="hero-copy">
               <span className="eyebrow">Skill enhancement starts here</span>
               <h1>Build practical skills with guided online courses.</h1>
               <p>
                  Discover focused learning paths, enroll in free or paid courses, track your progress,
                  and earn a completion certificate when you finish.
               </p>
               <div className="hero-actions">
                  <Link to={'/register'}><Button className='btn-lh-primary' size='lg'>Explore Courses</Button></Link>
                  <Link to={'/login'}><Button className='btn-lh-outline' size='lg'>Sign In</Button></Link>
               </div>
               <div className="hero-stats">
                  <div className="hero-stat">
                     <strong>3</strong>
                     <span>Learning categories</span>
                  </div>
                  <div className="hero-stat">
                     <strong>24/7</strong>
                     <span>Self-paced access</span>
                  </div>
                  <div className="hero-stat">
                     <strong>100%</strong>
                     <span>Progress focused</span>
                  </div>
               </div>
            </div>
            <div className="hero-panel" aria-label="Students learning together">
               <div className="hero-panel-card">
                  <h3>Current learning path</h3>
                  <p className="mb-2 text-muted">Complete modules, watch lessons, and download your certificate.</p>
                  <div className="hero-progress"><span /></div>
               </div>
            </div>
         </section>

         <Container className="section-shell">
            <div className="section-header">
               <div>
                  <h2>Trending Courses</h2>
                  <p>Browse popular lessons from LearnHub educators.</p>
               </div>
            </div>
            <AllCourses />
         </Container>
      </>
   )
}
export default Home
