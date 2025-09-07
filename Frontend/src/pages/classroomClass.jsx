import React, { useState, useRef } from 'react'
// import { useBgMotion } from '../hooks/useBgMotion';

//components
import ClassHeader from '../components/classroomClass/classHeader'
import ClassAssignmentPopup from '../components/classroomClass/classAssignmentPopup';
import ClassAnnouncementPopup from '../components/classroomClass/classAnnouncementPopup';

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
    </div>
  )
}

export default ClassroomClass