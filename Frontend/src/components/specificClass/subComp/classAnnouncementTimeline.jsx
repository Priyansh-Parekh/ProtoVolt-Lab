import React from 'react';
import { MdAnnouncement, MdSchedule, MdPerson } from "react-icons/md";

/**
 * Formats a MongoDB createdAt/updatedAt date string or Date object
 * Example output: "18 Oct 2025, 11:45 AM"
 */
const formatDate = (dateInput) => {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  };

  return date.toLocaleString(undefined, options);
};

const ClassAnnouncementTimeline = ({ announcements = [] }) => {
  // Sort announcements by creation date, newest first
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (!sortedAnnouncements.length) {
    return (
      <div className="ClassAnnouncementTimeline-container text-[var(--color-text-light)]">
        <h2 className="text-[var(--color-text-bright)] text-3xl font-bold mb-4 font-ChakraPetch">
          📢 Announcements
        </h2>
        <p>No announcements available.</p>
      </div>
    );
  }

  return (
    <div className="ClassAnnouncementTimeline-container">
      <h2 className="ClassAnnouncementTimeline-header text-[var(--color-text-bright)] text-3xl font-bold mb-6 font-ChakraPetch">
        📢 Announcements
      </h2>
      <div className="ClassAnnouncementTimeline-list space-y-5">
        {sortedAnnouncements.map((announcement) => (
          <div
            key={announcement._id}
            className="ClassAnnouncementTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition-all duration-300 w-full border border-transparent hover:border-[var(--color-accent-cyan)] hover:scale-[1.02] group"
          >
            {/* Header with Announcement Icon */}
            <div className="relative mb-4 pb-4 border-b border-[var(--color-border)]/30">
              <div className="absolute top-0 right-0 text-2xl">
                <MdAnnouncement
                  className="text-[var(--color-accent-cyan)] group-hover:text-[var(--color-accent-teal)] transition-colors duration-300"
                  title="Announcement"
                />
              </div>

              <h3 className="ClassAnnouncementTimeline-title text-[var(--color-accent-cyan)] font-bold text-xl font-ChakraPetch pr-12">
                {announcement.title}
              </h3>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="ClassAnnouncementTimeline-content text-sm text-[var(--color-text-light)] leading-relaxed">
                {announcement.content}
              </p>
            </div>

            {/* Professor Info */}
            <div className="mb-4 p-3 bg-[var(--color-primary)]/50 rounded-lg border border-[var(--color-border)]/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-cyan)]/10 rounded-full">
                  <MdPerson className="text-[var(--color-accent-cyan)] text-lg" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-placeholder)] font-medium">Professor</p>
                  <p className="text-sm text-[var(--color-text-bright)] font-ChakraPetch">
                    {announcement.professor?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="flex items-center gap-3 text-xs">
              <div className="p-1.5 bg-[var(--color-accent-cyan)]/10 rounded-full">
                <MdSchedule className="text-[var(--color-accent-cyan)]" />
              </div>
              <span className="text-[var(--color-placeholder)]">
                <span className="font-medium">Posted:</span> {formatDate(announcement.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassAnnouncementTimeline;
