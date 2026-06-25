import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { UserContext } from '../../../App';
import axiosInstance from '../../common/AxiosInstance';

const AddCourse = () => {
   const user = useContext(UserContext);
   const [addCourse, setAddCourse] = useState({
      userId: user.userData._id,
      C_educator: '',
      C_title: '',
      C_categories: '',
      C_price: '',
      C_description: '',
      sections: [],
   });
   const handleChange = (e) => {
      const { name, value } = e.target;
      setAddCourse({ ...addCourse, [name]: value });
   };

   const handleCourseTypeChange = (e) => {
      setAddCourse({ ...addCourse, C_categories: e.target.value });
   };

   const addInputGroup = () => {
      setAddCourse({
         ...addCourse,
         sections: [
            ...addCourse.sections,
            {
               S_title: '',
               S_description: '',
               S_content: null,
            },
         ],
      });
   };

   const handleChangeSection = (index, e) => {
      const updatedSections = [...addCourse.sections];
      const sectionToUpdate = updatedSections[index];

      if (e.target.name.endsWith('S_content')) {
         sectionToUpdate.S_content = e.target.files[0];
      } else {
         sectionToUpdate[e.target.name] = e.target.value;
      }

      setAddCourse({ ...addCourse, sections: updatedSections });
   };

   const removeInputGroup = (index) => {
      const updatedSections = [...addCourse.sections];
      updatedSections.splice(index, 1);
      setAddCourse({
         ...addCourse,
         sections: updatedSections,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData();
      Object.keys(addCourse).forEach((key) => {
         if (key === 'sections') {
            addCourse[key].forEach((section) => {
               if (section.S_content instanceof File) {
                  formData.append(`S_content`, section.S_content);
               }
               formData.append(`S_title`, section.S_title);
               formData.append(`S_description`, section.S_description);
            });
         } else {
            formData.append(key, addCourse[key]);
         }
      });

      try {
         const res = await axiosInstance.post('/api/user/addcourse', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === 201) {
            if (res.data.success) {
               alert(res.data.message);
            } else {
               alert('Failed to create course');
            }
         } else {
            alert('Unexpected response status: ' + res.status);
         }
      } catch (error) {
         console.error('An error occurred:', error);
         alert('An error occurred while creating the course, only .mp4 videos can be uploaded');
      }
   };

   return (
      <div className='form-panel'>
         <div className="section-header mb-3">
            <div>
               <h2>Create a course</h2>
               <p>Add course details and upload lesson modules.</p>
            </div>
         </div>
         <Form className="mb-3" onSubmit={handleSubmit}>
            <Row className="mb-3">
               <Form.Group as={Col} md={6} controlId="formGridJobType">
                  <Form.Label>Course Type</Form.Label>
                  <Form.Select value={addCourse.C_categories} onChange={handleCourseTypeChange}>
                     <option>Select categories</option>
                     <option>IT & Software</option>
                     <option>Finance & Accounting</option>
                     <option>Personal Development</option>
                  </Form.Select>
               </Form.Group>
               <Form.Group as={Col} md={6} controlId="formGridTitle">
                  <Form.Label>Course Title</Form.Label>
                  <Form.Control name='C_title' value={addCourse.C_title} onChange={handleChange} type="text" placeholder="Enter Course Title" required />
               </Form.Group>
            </Row>

            <Row className="mb-3">
               <Form.Group as={Col} md={4} controlId="formGridEducator">
                  <Form.Label>Course Educator</Form.Label>
                  <Form.Control name='C_educator' value={addCourse.C_educator} onChange={handleChange} type="text" placeholder="Enter Course Educator" required />
               </Form.Group>
               <Form.Group as={Col} md={4} controlId="formGridPrice">
                  <Form.Label>Course Price(Rs.)</Form.Label>
                  <Form.Control name='C_price' value={addCourse.C_price} onChange={handleChange} type="text" placeholder="For free course, enter 0" required />
               </Form.Group>
               <Form.Group as={Col} md={4} controlId="formGridDescription">
                  <Form.Label>Course Description</Form.Label>
                  <Form.Control name='C_description' value={addCourse.C_description} onChange={handleChange} required as={"textarea"} placeholder="Enter Course description" />
               </Form.Group>
            </Row>

            <hr />

            {addCourse.sections.map((section, index) => (
               <div key={index} className="module-card d-flex flex-column mb-4 p-3 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                     <strong>Module {index + 1}</strong>
                     <Button size="sm" variant="outline-danger" onClick={() => removeInputGroup(index)}>
                        Remove
                     </Button>
                  </div>
                  <Row className='mb-3'>
                     <Form.Group as={Col} md={6} controlId={`sectionTitle${index}`}>
                        <Form.Label>Section Title</Form.Label>
                        <Form.Control name={`S_title`} value={section.S_title} onChange={(e) => handleChangeSection(index, e)} type="text" placeholder="Enter Section Title" required />
                     </Form.Group>
                     <Form.Group as={Col} md={6} controlId={`sectionContent${index}`}>
                        <Form.Label>Section Content (Video or Image)</Form.Label>
                        <Form.Control name={`S_content`} onChange={(e) => handleChangeSection(index, e)} type="file" accept="video/*,image/*" required />
                     </Form.Group>
                     <Form.Group className="mt-3" controlId={`sectionDescription${index}`}>
                        <Form.Label>Section Description</Form.Label>
                        <Form.Control name={`S_description`} value={section.S_description} onChange={(e) => handleChangeSection(index, e)} required as={"textarea"} placeholder="Enter Section description" />
                     </Form.Group>
                  </Row>
               </div>
            ))}

            <div className="d-flex justify-content-between flex-wrap gap-2">
               <Button className='btn-lh-outline' onClick={addInputGroup}>
                  Add Section
               </Button>
               <Button className="btn-lh-primary" type="submit">
                  Submit Course
               </Button>
            </div>
         </Form>
      </div>
   );
};
export default AddCourse;
