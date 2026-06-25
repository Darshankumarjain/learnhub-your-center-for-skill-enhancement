import React, { useEffect, useState } from 'react'
import axiosInstance from '../../common/AxiosInstance';
import { Link } from 'react-router-dom';
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
   [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#eff6ff',
      color: '#0f172a',
      fontWeight: 800,
   },
   [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
   },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
   '&:nth-of-type(odd)': {
      backgroundColor: '#f8fafc',
   },
   '&:last-child td, &:last-child th': {
      border: 0,
   },
}));
const EnrolledCourses = () => {
   const [allEnrolledCourese, setAllEnrolledCourses] = useState([])
   const allCourses = async () => {
      try {
         const res = await axiosInstance.get('api/user/getallcoursesuser', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllEnrolledCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }
   useEffect(() => {
      allCourses()
   }, [])
   return (
      <TableContainer className="table-panel" component={Paper}>
         <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell align="left">Course Name</StyledTableCell>
                  <StyledTableCell align="left">Course Educator</StyledTableCell>
                  <StyledTableCell align="left">Course Category</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allEnrolledCourese?.length > 0 ? (
                     allEnrolledCourese?.map((course) => (
                        <StyledTableRow key={course._id}>
                           <StyledTableCell component="th" scope="row">{course._id}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{course.C_title}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{course.C_educator}</StyledTableCell>
                           <StyledTableCell component="th" scope="row"><span className="badge-role">{course.C_categories}</span></StyledTableCell>
                           <StyledTableCell component="th" scope="row">
                              <Link to={`/courseSection/${course._id}/${course.C_title}`}><Button size='small' variant="contained">Go To</Button></Link>
                           </StyledTableCell>
                        </StyledTableRow>
                     )))
                     :
                     (<StyledTableRow><StyledTableCell colSpan={5}>You have not enrolled in any courses yet.</StyledTableCell></StyledTableRow>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}
export default EnrolledCourses
