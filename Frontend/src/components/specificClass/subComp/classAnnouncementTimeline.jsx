import React from 'react';
import { announcementSeed } from '../../../seeds/data';
import { AiOutlineCalendar } from "react-icons/ai";
import { GrAnnounce } from "react-icons/gr";

// Helper function to format dates consistently
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const ClassAnnouncementTimeline = () => {
  // Sort announcements by creation date, newest first
  const sortedAnnouncements = [...announcementSeed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="ClassAnnouncementTimeline-container">
      <h2 className="ClassAnnouncementTimeline-header text-[var(--color-text-bright)] text-3xl font-bold mb-6 font-ChakraPetch">
        📢 Announcements
      </h2>
      <div className="ClassAnnouncementTimeline-list space-y-5">
        {sortedAnnouncements.map((announcement) => (
          <div
            key={announcement._id}
            className="ClassAnnouncementTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition w-full"
          >
            {/* Top-right type icon */}
            <div className="ClassAnnouncementTimeline-icon-wrapper absolute top-4 right-4 text-xl">
              <GrAnnounce
                className="ClassAnnouncementTimeline-icon text-[var(--color-accent-cyan)]"
                title="Announcement"
              />
            </div>

            {/* Title */}
            <h3 className="ClassAnnouncementTimeline-title text-[var(--color-accent-cyan)] font-bold text-xl font-ChakraPetch">
              {announcement.title}
            </h3>

            {/* Content */}
            <p className="ClassAnnouncementTimeline-content text-sm mt-3 text-[var(--color-text-light)]">{announcement.content}</p>

            {/* Date info */}
            <div className="ClassAnnouncementTimeline-date-wrapper flex items-center gap-2 mt-4 text-xs text-[var(--color-placeholder)]">
              <AiOutlineCalendar className="ClassAnnouncementTimeline-date-icon" />
              <span className="ClassAnnouncementTimeline-date-text">
                Posted: {formatDate(announcement.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassAnnouncementTimeline;

