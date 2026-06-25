import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Modal } from 'react-bootstrap';
import axiosInstance from '../../common/AxiosInstance';
import ReactPlayer from 'react-player';
import { UserContext } from '../../../App';
import NavBar from '../../common/NavBar';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Button } from '@mui/material';

const CourseContent = () => {
   const user = useContext(UserContext)
   const { courseId, courseTitle } = useParams();
   const [courseContent, setCourseContent] = useState([]);
   const [currentVideo, setCurrentVideo] = useState(null);
   const [playingSectionIndex, setPlayingSectionIndex] = useState(-1);
   const [completedSections, setCompletedSections] = useState([]);
   const [completedModule, setCompletedModule] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [certificate, setCertificate] = useState(null)
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
   const completedModuleIds = completedModule.map((item) => item.sectionId);
   const downloadPdfDocument = (rootElementId) => {
      const input = document.getElementById(rootElementId);
      html2canvas(input).then((canvas) => {
         const imgData = canvas.toDataURL('image/png');
         const pdf = new jsPDF();
         pdf.addImage(imgData, 'JPEG', -35, 10);
         pdf.save('download-certificate.pdf');
      });
   };

   const getCourseContent = async () => {
      try {
         const res = await axiosInstance.get(`/api/user/coursecontent/${courseId}`, {
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
         });
         if (res.data.success) {
            setCourseContent(res.data.courseContent);
            setCompletedModule(res.data.completeModule)
            setCertificate(res.data.certficateData.updatedAt)
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getCourseContent();
   }, [courseId]);
   const playVideo = (videoPath, index) => {
      setCurrentVideo(videoPath);
      setPlayingSectionIndex(index);
   };
   const completeModule = async (sectionId) => {
      if (completedModule.length < courseContent.length) {
         if (playingSectionIndex !== -1 && !completedSections.includes(playingSectionIndex)) {
            setCompletedSections([...completedSections, playingSectionIndex]);
            try {
               const res = await axiosInstance.post(`api/user/completemodule`, {
                  courseId,
                  sectionId: sectionId
               }, {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
               });
               if (res.data.success) {
                  alert(res.data.message);
                  getCourseContent()
               }
            } catch (error) {
               console.log(error);
            }
         }
      } else {
         setShowModal(true);
      }
   };
   return (
      <>
         <NavBar />
         <div className='course-page-title'>
            <span className="badge-role">Course player</span>
            <h1>{courseTitle}</h1>
            <p className="text-muted">Watch each module and mark it complete to unlock your certificate.</p>
         </div>
         <div className='course-content'>
            <div className="course-section">
               <Accordion defaultActiveKey="0" flush>
                  {courseContent.map((section, index) => {
                     const sectionId = index;
                     const isSectionCompleted = !completedModuleIds.includes(sectionId);
                     return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                           <Accordion.Header>{index + 1}. {section.S_title}</Accordion.Header>
                           <Accordion.Body>
                              <p className="text-muted">{section.S_description}</p>
                              {section.S_content && (
                                 <div className="d-flex gap-2 flex-wrap">
                                    <Button color='primary' variant="contained" size="small" onClick={() => playVideo(`http://localhost:8000${section.S_content.path}`, index)}>
                                       Play Video
                                    </Button>
                                    {isSectionCompleted && !completedSections.includes(index) && (
                                       <Button
                                          color='success'
                                          variant='outlined'
                                          size='small'
                                          onClick={() => completeModule(sectionId)}
                                          disabled={playingSectionIndex !== index}
                                       >
                                          Completed
                                       </Button>
                                    )}
                                 </div>
                              )}
                           </Accordion.Body>
                        </Accordion.Item>
                     );
                  })}
                  {completedModule.length === courseContent.length && (
                     <div className="p-3">
                        <Button variant="contained" onClick={() => setShowModal(true)}>Download Certificate</Button>
                     </div>
                  )}
               </Accordion>
            </div>
            <div className="course-video">
               {currentVideo ? (
                  <ReactPlayer
                     url={currentVideo}
                     width='100%'
                     height='100%'
                     controls
                  />
               ) : (
                  <div className="course-video-empty">
                     <h3>Select a lesson to begin</h3>
                     <p>Course videos will appear here.</p>
                  </div>
               )}
            </div>
         </div>
         <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
         >
            <Modal.Header closeButton>
               <Modal.Title id="example-custom-modal-styling-title">
                  Completion Certificate
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>Congratulations. You have completed all sections.</p>
               <div id='certificate-download' className="certificate text-center">
                  <h1>Certificate of Completion</h1>
                  <div className="content">
                     <p>This is to certify that</p>
                     <h2>{user.userData.name}</h2>
                     <p>has successfully completed the course</p>
                     <h3>{courseTitle}</h3>
                     <p>on</p>
                     <p className="date">{new Date(certificate).toLocaleDateString()}</p>
                  </div>
               </div>
               <Button onClick={() => downloadPdfDocument('certificate-download')} style={{ float: 'right', marginTop: 12 }} variant="contained">Download Certificate</Button>
            </Modal.Body>
         </Modal>
      </>
   );
};
export default CourseContent;



