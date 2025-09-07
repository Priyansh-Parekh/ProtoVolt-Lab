import React from "react";
import { announcementSeed, assignmentSeed } from "../../seeds/data";
import { AiOutlineFile, AiOutlineCalendar,  AiOutlinePaperClip } from "react-icons/ai";
import { GrAnnounce } from "react-icons/gr";
import { Link } from "react-router-dom";

const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const ClassTimeline = () => {
  const timeline = [
    ...announcementSeed.map((a) => ({ ...a, type: "announcement", date: a.createdAt })),
    ...assignmentSeed.map((a) => ({ ...a, type: "assignment", date: a.createdAt })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="m-auto pb-5 bg-[var(--color-primary)] text-[var(--color-text-light)] w-max min-w-200">
      <h2 className="text-[var(--color-text-bright)] text-3xl font-bold mb-6">
        🕒 Class Timeline
      </h2>

      <div className="space-y-5">
        {timeline.map((item) => (
          <div
            key={item._id}
            className="relative bg-[var(--color-secondary)] p-6 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition w-full"
          >
            {/* Top-right type icon */}
            <div className="absolute top-4 right-4 text-xl">
              {item.type === "announcement" ? (
                <GrAnnounce
                  className="text-[var(--color-accent-cyan)]"
                  title="Announcement"
                />
              ) : (
                <AiOutlineFile
                  className="text-[var(--color-accent-cyan)]"
                  title="Assignment"
                />
              )}
            </div>

            {/* Title */}
            {item.type === "assignment" ? (
              <Link
                to={`/assignments/${item._id}`}
                className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)] font-bold text-xl"
              >
                {item.title}
              </Link>
            ) : (
              <h3 className="text-[var(--color-text-bright)] font-bold text-xl">
                {item.title}
              </h3>
            )}

            {/* Content / description */}
            <p className="text-sm mt-3">{item.content || item.description}</p>

            {/* Date info */}
            <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-placeholder)]">
              <AiOutlineCalendar />
              <span>
                {item.type === "announcement" ? "Created: " : "Assigned: "}{" "}
                {formatDate(item.date)}
              </span>
            </div>

            {/* Attached file */}
            {item.uploadedFiles && (
              <a
                href={item.uploadedFiles}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--color-text-bright)] hover:text-[var(--color-accent-cyan)] text-sm mt-3"
              >
                <AiOutlinePaperClip />
                <span>Attached File</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassTimeline;
