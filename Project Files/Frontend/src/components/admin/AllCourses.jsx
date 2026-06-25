import React, { useState, useEffect } from 'react'
import { Button, styled, TableRow, TableHead, TableContainer, Paper, Table, TableBody, TableCell, tableCellClasses } from '@mui/material'
import axiosInstance from '../common/AxiosInstance'

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
const AllCourses = () => {
   const [allCourses, setAllCourses] = useState([])
   const allCoursesList = async () => {
      try {
         const res = await axiosInstance.get('api/admin/getallcourses', {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         })
         if (res.data.success) {
            setAllCourses(res.data.data)
         }
         else {
            alert(res.data.message)
         }
      } catch (error) {
         console.log(error);
      }
   }
   useEffect(() => {
      allCoursesList()
   }, [])
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
            allCoursesList()
         } else {
            alert("Failed to delete the course")
         }
      } catch (error) {
         console.log('An error occurred:', error);
      }
   }
   return (
      <TableContainer className="table-panel" component={Paper}>
         <Table sx={{ minWidth: 900 }} aria-label="customized table">
            <TableHead>
               <TableRow>
                  <StyledTableCell>Course ID</StyledTableCell>
                  <StyledTableCell align="left">Course Name</StyledTableCell>
                  <StyledTableCell align="left">Course Educator</StyledTableCell>
                  <StyledTableCell align="left">Course Category</StyledTableCell>
                  <StyledTableCell align="left">Course Price</StyledTableCell>
                  <StyledTableCell align="left">Course Sections</StyledTableCell>
                  <StyledTableCell align="left">Enrolled Students</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {
                  allCourses.length > 0 ? (
                     allCourses.map((Course) => (
                        <StyledTableRow key={Course._id}>
                           <StyledTableCell component="th" scope="row">{Course._id}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{Course.C_title}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{Course.C_educator}</StyledTableCell>
                           <StyledTableCell component="th" scope="row"><span className="badge-role">{Course.C_categories}</span></StyledTableCell>
                           <StyledTableCell component="th" scope="row">{Course.C_price}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{Course.sections.length}</StyledTableCell>
                           <StyledTableCell component="th" scope="row">{Course.enrolled}</StyledTableCell>
                           <StyledTableCell align="center" component="th" scope="row">
                              <Button onClick={() => deleteCourse(Course._id)} size='small' color="error" variant="outlined">Delete</Button>
                           </StyledTableCell>
                        </StyledTableRow>
                     )))
                     :
                     (<StyledTableRow><StyledTableCell colSpan={8}>No courses found.</StyledTableCell></StyledTableRow>)
               }
            </TableBody>
         </Table>
      </TableContainer>
   )
}
export default AllCourses
