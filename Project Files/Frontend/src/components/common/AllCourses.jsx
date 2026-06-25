import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import {
   MDBCol,
   MDBInput,
   MDBRow,
} from "mdb-react-ui-kit";

const AllCourses = () => {
   const navigate = useNavigate()
   const user = useContext(UserContext)
   const [allCourses, setAllCourses] = useState([]);
   const [filterTitle, setFilterTitle] = useState('');
   const [filterType, setFilterType] = useState('');
   const [showModal, setShowModal] = useState(Array(allCourses.length).fill(false));
   const [cardDetails, setCardDetails] = useState({
      cardholdername: '',
      cardnumber: '',
      cvvcode: '',
      expmonthyear: '',
   })
   const handleChange = (e) => {
      setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
   }
   const handleShow = (courseIndex, coursePrice, courseId, courseTitle) => {
      if (coursePrice == 'free' || coursePrice == '0') {
         handleSubmit(courseId)
         return navigate(`/courseSection/${courseId}/${courseTitle}`)
      } else {
         const updatedShowModal = [...showModal];
         updatedShowModal[courseIndex] = true;
         setShowModal(updatedShowModal);
      }
   };
   const handleClose = (courseIndex) => {
      const updatedShowModal = [...showModal];
      updatedShowModal[courseIndex] = false;
      setShowModal(updatedShowModal);
   };
   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcourses`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (res.data.success) {
            setAllCourses(res.data.data);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   };
   useEffect(() => {
      getAllCoursesUser();
   }, []);
   const isPaidCourse = (course) => {
      return /\d/.test(course.C_price) && course.C_price !== '0';
   };
   const handleSubmit = async (courseId) => {
      try {
         const res = await axiosInstance.post(`api/user/enrolledcourse/${courseId}`, cardDetails, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         } else {
            alert(res.data.message);
            navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }
   return (
      <>
         <div className="filter-container">
            <p>Search by</p>
            <input
               type="text"
               placeholder="Course title"
               value={filterTitle}
               onChange={(e) => setFilterTitle(e.target.value)}
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
               <option value="">All Courses</option>
               <option value="Paid">Paid</option>
               <option value="Free">Free</option>
            </select>
         </div>
         <div className='course-container'>
            {allCourses?.length > 0 ? (
               allCourses
                  .filter(
                     (course) =>
                        filterTitle === '' ||
                        course.C_title?.toLowerCase().includes(filterTitle?.toLowerCase())
                  )
                  .filter((course) => {
                     if (filterType === 'Free') {
                        return !isPaidCourse(course);
                     } else if (filterType === 'Paid') {
                        return isPaidCourse(course);
                     } else {
                        return true;
                     }
                  })
                  .map((course, index) => (
                     <article key={course._id} className="course-card">
                        <div className="course-card-top">
                           <span className="badge-soft">{course.C_categories}</span>
                           <h3>{course.C_title}</h3>
                        </div>
                        <div className="course-card-body">
                           <p className="text-muted mb-3">by {course.C_educator}</p>
                           <div className="course-meta">
                              <div className="course-meta-item">
                                 <span>Sections</span>
                                 <strong>{course.sections.length}</strong>
                              </div>
                              <div className="course-meta-item">
                                 <span>Students</span>
                                 <strong>{course.enrolled}</strong>
                              </div>
                              <div className="course-meta-item">
                                 <span>Price</span>
                                 <strong>{course.C_price}</strong>
                              </div>
                              <div className="course-meta-item">
                                 <span>Type</span>
                                 <strong>{isPaidCourse(course) ? 'Paid' : 'Free'}</strong>
                              </div>
                           </div>
                           {course.sections.length > 0 && (
                              <p className="text-muted small mb-3">
                                 First module: {course.sections[0].S_title}
                              </p>
                           )}
                           {user.userLoggedIn === true ?
                              <>
                                 <Button
                                    className="btn-lh-primary w-100"
                                    size='sm'
                                    onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                                 >
                                    Start Course
                                 </Button>
                                 <Modal show={showModal[index]} onHide={() => handleClose(index)}>
                                    <Modal.Header closeButton>
                                       <Modal.Title>
                                          Payment for {course.C_title}
                                       </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                       <p className="mb-1">Educator: {course.C_educator}</p>
                                       <p className="mb-3">Price: {course.C_price}</p>
                                       <Form onSubmit={(e) => {
                                          e.preventDefault()
                                          handleSubmit(course._id)
                                       }}>
                                          <MDBInput className='mb-2' label="Card Holder Name" name='cardholdername' value={cardDetails.cardholdername} onChange={handleChange} type="text" size="md" placeholder="Cardholder's Name" contrast required />
                                          <MDBInput className='mb-2' name='cardnumber' value={cardDetails.cardnumber} onChange={handleChange} label="Card Number" type="number" size="md" minLength="0" maxLength="16" placeholder="1234 5678 9012 3457" required />
                                          <MDBRow className="mb-4">
                                             <MDBCol md="6">
                                                <MDBInput name='expmonthyear' value={cardDetails.expmonthyear} onChange={handleChange} className="mb-2" label="Expiration" type="text" size="md" placeholder="MM/YYYY" required />
                                             </MDBCol>
                                             <MDBCol md="6">
                                                <MDBInput name='cvvcode' value={cardDetails.cvvcode} onChange={handleChange} className="mb-2" label="Cvv" type="number" size="md" minLength="3" maxLength="3" placeholder="123" required />
                                             </MDBCol>
                                          </MDBRow>
                                          <div className="d-flex justify-content-end">
                                             <Button className='mx-2 btn-lh-outline' onClick={() => handleClose(index)}>
                                                Close
                                             </Button>
                                             <Button className="btn-lh-primary" type='submit'>
                                                Pay Now
                                             </Button>
                                          </div>
                                       </Form>
                                    </Modal.Body>
                                 </Modal>
                              </>
                              : <Link to={'/login'}><Button className="btn-lh-primary w-100" size='sm'>Start Course</Button></Link>}
                        </div>
                     </article>
                  ))
            ) : (
               <p className="empty-state">No courses at the moment</p>
            )}
         </div>
      </>
   );
};
export default AllCourses;
