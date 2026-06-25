import React, { useContext, useState } from 'react';
import NavBar from './NavBar';
import UserHome from "./UserHome"
import { Container } from 'react-bootstrap';
import AddCourse from '../user/teacher/AddCourse';
import EnrolledCourses from '../user/student/EnrolledCourses';
import CourseContent from '../user/student/CourseContent';
import AllCourses from '../admin/AllCourses';
import { UserContext } from '../../App';

const Dashboard = () => {
   const user = useContext(UserContext)
   const [selectedComponent, setSelectedComponent] = useState('home');
   const renderSelectedComponent = () => {
      switch (selectedComponent) {
         case 'home':
            return <UserHome />
         case 'addcourse':
            return <AddCourse />
         case 'enrolledcourese':
            return <EnrolledCourses />
         case 'cousreSection':
            return <CourseContent />
         case 'cousres':
            return <AllCourses />
         default:
            return <UserHome />
      }
   };
   return (
      <>
         <NavBar setSelectedComponent={setSelectedComponent} />
         <Container fluid="xl" className='dashboard-shell'>
            <div className="dashboard-title">
               <span className="badge-role">{user?.userData?.type || 'User'} dashboard</span>
               <h1>Welcome back, {user?.userData?.name}</h1>
               <p>Manage learning activity, courses, and progress from one clean workspace.</p>
            </div>
            <div className="dashboard-content">
               {renderSelectedComponent()}
            </div>
         </Container>
      </>
   );
};
export default Dashboard;
