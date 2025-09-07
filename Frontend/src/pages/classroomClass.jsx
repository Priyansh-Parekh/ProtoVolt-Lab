import React, { useState, useRef } from 'react'
// import { useBgMotion } from '../hooks/useBgMotion';

//components
import ClassHeader from '../components/classroomClass/classHeader'
import ClassAssignmentPopup from '../components/classroomClass/classAssignmentPopup';
import ClassAnnouncementPopup from '../components/classroomClass/classAnnouncementPopup';
import ClassTimeline from '../components/classroomClass/classTimeline';
import Sidebar3DModel from '../components/classroomClass/sideBar3DModel';

const ClassroomClass = () => {
  const [assigned,setAssigned] = useState(false);
  const [announced,setAnnounced] = useState(false);

  // const containerRef = useRef(null);

  // useBgMotion(containerRef);

  return (
    <div  className='h-max min-h-screen bg-[var(--color-primary)] z-[-1]'>
        <ClassHeader setAssigned={setAssigned}  setAnnounced={setAnnounced}/>
        {assigned&& <ClassAssignmentPopup setAssigned={setAssigned}  />}
        {announced&& <ClassAnnouncementPopup setAnnounced={setAnnounced} /> }
        <div className="flex">
  {/* Left Sidebar */}
  <div className="w-64 mt-10 ml-2 h-screen bg-transparent relative">
    <Sidebar3DModel />
  </div>

  {/* Main Content */}
  <div className="flex-1 px-6 mr-60">
    <ClassTimeline />
  </div>
</div>

    </div>
  )
}

export default ClassroomClass