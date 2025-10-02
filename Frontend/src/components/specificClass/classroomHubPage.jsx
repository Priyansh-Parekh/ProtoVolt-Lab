import React from 'react';

// import components
import ClassAssignmentTimeline from './subComp/classAssignmentTimeline';
import ClassAnnouncementTimeline from './subComp/classAnnouncementTimeline';

const ClassroomHubPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-primary)] p-8 text-[var(--color-text-light)]">
      <h1 className="text-4xl font-bold text-[var(--color-text-bright)] mb-8 font-ChakraPetch">
        Classroom Hub
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column for Assignments (takes up 2/3 of the space on large screens) */}
        <div className="w-full lg:w-2/3">
        <ClassAssignmentTimeline/>
        </div>
        
        {/* Right Column for Announcements (takes up 1/3 of the space on large screens) */}
        <div className="w-full lg:w-1/3">
        <ClassAnnouncementTimeline/>
        </div>
      </div>
    </div>
  );
};

export default ClassroomHubPage;
