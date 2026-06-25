import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';

const TeacherHome = () => {
   const [allCourses, setAllCourses] = useState([]);

   const getAllCoursesUser = async () => {
      try {
         const res = await axiosInstance.get(`api/user/getallcoursesteacher`, {
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

   const toggleDescription = (courseId) => {
      setAllCourses((prevCourses) =>
         prevCourses.map((course) =>
            course._id === courseId
               ? { ...course, showFullDescription: !course.showFullDescription }
               : course
         )
      );
   };

   const deleteCourse = async (courseId) => {
      const confirmation = confirm('Are you sure you want to delete')
      if (!confirmation) {
         return;
      }
      try {
         const res = await axiosInstance.delete(`api/user/deletecourse/${courseId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         if (res.data.success) {
            alert(res.data.message)
            getAllCoursesUser()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }

   return (
      <Container className='card-container p-0'>
         {allCourses?.length > 0 ? (
            allCourses.map((course) => (
               <article key={course._id} className='teacher-course-card'>
                  <div className="course-card-top">
                     <span className="badge-soft">{course.C_categories}</span>
                     <h3>{course.C_title}</h3>
                  </div>
                  <div className="course-card-body">
                     <p className="text-muted">
                        {course.showFullDescription
                           ? course.C_description
                           : course.C_description.slice(0, 80)}
                        {course.C_description.length > 80 && (
                           <span
                              className='read-more-link ms-1'
                              onClick={() => toggleDescription(course._id)}
                           >
                              {course.showFullDescription ? 'Read Less' : 'Read More'}
                           </span>
                        )}
                     </p>
                     <div className="course-meta">
                        <div className="course-meta-item">
                           <span>Sections</span>
                           <strong>{course.sections.length}</strong>
                        </div>
                        <div className="course-meta-item">
                           <span>Enrolled</span>
                           <strong>{course.enrolled}</strong>
                        </div>
                     </div>
                     <Button className='btn-lh-outline w-100' onClick={() => deleteCourse(course._id)}>Delete Course</Button>
                  </div>
               </article>
            ))
         ) : (
            <p className="empty-state">No courses found.</p>
         )}
      </Container>
   );
};

export default TeacherHome;
