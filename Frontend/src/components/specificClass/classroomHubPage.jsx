import React, { useState, useEffect } from 'react';
import { MdAssignment, MdAnnouncement } from "react-icons/md";

// import components
import ClassAssignmentTimeline from './subComp/classAssignmentTimeline.jsx';
import ClassAnnouncementTimeline from './subComp/classAnnouncementTimeline.jsx';

const ClassroomHubPage = ({ isclassroom }) => {
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    if (isclassroom) setClassroom(isclassroom);
  }, [isclassroom]);

  if (!classroom) return (
    <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--color-border)] border-t-[var(--color-accent-cyan)] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[var(--color-accent-teal)] rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--color-text-bright)] font-ChakraPetch mb-2">
            Loading Classroom
          </h2>
          <p className="text-[var(--color-text-light)] text-sm">
            Fetching classroom data...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-primary)] p-8 text-[var(--color-text-light)]">
      <h1 className="text-4xl font-bold text-[var(--color-text-bright)] mb-8 font-ChakraPetch">
        {classroom.course}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {/* Assignments Section */}
          <div className="flex items-center gap-2 mb-4">
            <MdAssignment className="text-[var(--color-accent-cyan)] text-3xl" />
            <h2 className="text-[var(--color-text-bright)] text-3xl font-bold font-ChakraPetch">
              Assignments
            </h2>
          </div>
          <ClassAssignmentTimeline classroomId={classroom._id} assignments={classroom.assignments || []} />
        </div>

        <div className="w-full lg:w-1/3">
          {/* Announcements Section */}
          <div className="flex items-center gap-2 mb-4">
            <MdAnnouncement className="text-[var(--color-accent-cyan)] text-3xl" />
            <h2 className="text-[var(--color-text-bright)] text-3xl font-bold font-ChakraPetch">
              Announcements
            </h2>
          </div>
          <ClassAnnouncementTimeline announcements={classroom.announcements || []} />
        </div>
      </div>
    </div>
  );
};

export default ClassroomHubPage;