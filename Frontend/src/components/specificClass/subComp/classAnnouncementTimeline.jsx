import React from 'react';
import { MdAnnouncement, MdSchedule, MdPerson, MdAttachFile } from "react-icons/md";

const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const options = { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleString(undefined, options);
};

const ClassAnnouncementTimeline = ({ announcements = [] }) => {
  const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!sortedAnnouncements.length) {
    return <p className="text-[var(--color-text-light)]">No announcements available.</p>;
  }

  return (
    <div className="ClassAnnouncementTimeline-container">
      <div className="ClassAnnouncementTimeline-list space-y-5">
        {sortedAnnouncements.map((announcement) => (
          <div
            key={announcement._id}
            className="ClassAnnouncementTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-xl shadow-[var(--shadow-soft)] border border-[var(--color-accent-cyan)] hover:shadow-[var(--shadow-neon)] transition-all duration-300 w-full hover:scale-[1.02] group"
          >
            <div className="relative mb-4 pb-4 border-b border-[var(--color-border)]/30">
              <div className="absolute top-0 right-0 text-2xl">
                <MdAnnouncement className="text-[var(--color-accent-cyan)] group-hover:text-[var(--color-accent-teal)] transition-colors duration-300" />
              </div>
              <h3 className="text-[var(--color-accent-cyan)] font-bold text-xl font-ChakraPetch pr-12">
                {announcement.title}
              </h3>
            </div>

            <p className="text-sm text-[var(--color-text-light)] leading-relaxed mb-4">{announcement.content}</p>

            {announcement.file && (
              <div className="mb-4 p-3 bg-[var(--color-primary)]/50 rounded-lg border border-[var(--color-border)]/20">
                <a
                  href={announcement.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group/file hover:bg-[var(--color-primary)]/70 transition-colors duration-200 rounded-md p-2 -m-2"
                >
                  <div className="p-2 bg-[var(--color-accent-cyan)]/10 rounded-full">
                    <MdAttachFile className="text-[var(--color-accent-cyan)] text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--color-placeholder)] font-medium">Attached File</p>
                    <p className="text-sm text-[var(--color-accent-cyan)] font-ChakraPetch truncate">View File</p>
                  </div>
                </a>
              </div>
            )}

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