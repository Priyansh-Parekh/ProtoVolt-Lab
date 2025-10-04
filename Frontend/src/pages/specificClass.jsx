import React, { useState, useRef } from 'react'
// import { useBgMotion } from '../hooks/useBgMotion';

//components
import ClassHeader from '../components/specificClass/classHeader'
// import ClassAssignmentPopup from '../components/specificClass/classAssignmentPopup';
import ClassAnnouncementPopup from '../components/specificClass/classAnnouncementPopup';
import ClassroomHubPage from '../components/specificClass/classroomHubPage';

const SpecificClass = () => {
  // const [assigned,setAssigned] = useState(false);
  const [announced,setAnnounced] = useState(false);

  // const containerRef = useRef(null);

  // useBgMotion(containerRef);

  return (
    <div  className='h-max min-h-screen bg-[var(--color-primary)] z-[-1]'>
        <ClassHeader /*setAssigned={setAssigned}*/  setAnnounced={setAnnounced}/>
        {/* {assigned&& <ClassAssignmentPopup setAssigned={setAssigned}  />} */}
        {announced&& <ClassAnnouncementPopup setAnnounced={setAnnounced} /> }
        <div className="flex">
  {/* Main Content */}
  <div className="flex-1 px-6 ">
    <ClassroomHubPage />
  </div>
</div>

    </div>
  )
}

export default SpecificClass