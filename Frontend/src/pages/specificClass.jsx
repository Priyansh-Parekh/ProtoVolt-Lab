import React, { useState, useEffect,useRef } from 'react'
import { useSearchParams } from 'react-router-dom';

//components
import ClassHeader from '../components/specificClass/classHeader'
import ClassAnnouncementPopup from '../components/specificClass/classAnnouncementPopup';
import ClassroomHubPage from '../components/specificClass/classroomHubPage';
import Sidebar from '../components/classroom/sidebar';

//import utils
import api from '../utils/axios';
import { error } from '../utils/toastify';

const SpecificClass = ({user}) => {

  const [announced,setAnnounced] = useState(false);
  const[classroom,setClassroom] = useState(null);
  const [searchParams] = useSearchParams();
  const _id = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/classroom/data/getClassroom", { params:{_id} });

        if (res.data.success) {
          setClassroom(res.data.classroom);
        } else {
          error(res.data.message);
        }
      } catch (err) {
        console.error(err);
        error("Failed to fetch classroom data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex bg-[var(--color-primary)] min-h-screen">
      {/* Sidebar (persistent across class pages) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col z-10">
        {/* Header */}
        <ClassHeader user={user} className={classroom?.name} setAnnounced={setAnnounced} />

        {/* Announcement Popup */}
        {announced && <ClassAnnouncementPopup setAnnounced={setAnnounced} />}
  {/* Main Content */}
  <div className="flex-1 px-6 ">
    <ClassroomHubPage isclassroom={classroom} />
  </div>
</div>

    </div>
  )
}

export default SpecificClass