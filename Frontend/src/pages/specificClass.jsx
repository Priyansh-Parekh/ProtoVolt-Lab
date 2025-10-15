import React, { useState, useRef } from 'react'
// import { useBgMotion } from '../hooks/useBgMotion';

//components
import ClassHeader from '../components/specificClass/classHeader'
// import ClassAssignmentPopup from '../components/specificClass/classAssignmentPopup';
import ClassAnnouncementPopup from '../components/specificClass/classAnnouncementPopup';
import ClassroomHubPage from '../components/specificClass/classroomHubPage';
import Sidebar from '../components/classroom/sidebar';

const SpecificClass = ({user}) => {
  // const [assigned,setAssigned] = useState(false);
  const [announced,setAnnounced] = useState(false);

  // const containerRef = useRef(null);

  // useBgMotion(containerRef);

  return (
    <div className="flex bg-[var(--color-primary)] min-h-screen">
      {/* Sidebar (persistent across class pages) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col z-10">
        {/* Header */}
        <ClassHeader user={user} setAnnounced={setAnnounced} />

        {/* Announcement Popup */}
        {announced && <ClassAnnouncementPopup setAnnounced={setAnnounced} />}
  {/* Main Content */}
  <div className="flex-1 px-6 ">
    <ClassroomHubPage />
  </div>
</div>

    </div>
  )
}

export default SpecificClass