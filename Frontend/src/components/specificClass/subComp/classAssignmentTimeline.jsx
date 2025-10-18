import React from 'react';
import { MdAssignment, MdSchedule, MdPerson, MdAccessTime } from "react-icons/md";
import { Link } from "react-router-dom";

// Helper function to format MongoDB timestamps
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

  return date.toLocaleDateString(undefined, options); // <- use toLocaleString
};

const ClassAssignmentTimeline = ({ assignments=[] }) => {
  // Sort assignments by creation date, newest first
  const sortedAssignments = [...assignments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="ClassAssignmentTimeline-container">
      <h2 className="ClassAssignmentTimeline-header text-[var(--color-text-bright)] text-3xl font-bold mb-6 font-ChakraPetch">
        📚 Assignments
      </h2>
      <div className="ClassAssignmentTimeline-list space-y-5">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="ClassAssignmentTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition-all duration-300 w-full border border-transparent hover:border-[var(--color-accent-cyan)] hover:scale-[1.02] group"
          >
            {/* Header with Assignment Icon */}
            <div className="relative mb-4 pb-4 border-b border-[var(--color-border)]/30">
              <div className="absolute top-0 right-0 text-2xl">
                <MdAssignment
                  className="text-[var(--color-accent-cyan)] group-hover:text-[var(--color-accent-teal)] transition-colors duration-300"
                  title="Assignment"
                />
              </div>

              {/* Title - Link to specific assignment page */}
              <Link
                to={`/classroom/class/assignment?_id=${assignment._id}`}
                className="ClassAssignmentTimeline-title text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)] font-bold text-xl font-ChakraPetch pr-12 transition-colors duration-300"
              >
                {assignment.title}
              </Link>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="ClassAssignmentTimeline-description text-sm text-[var(--color-text-light)] leading-relaxed">
                {assignment.description}
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
                    {assignment.professor.name || "Dr. Smith"}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div className="space-y-2">
              {/* Assigned date */}
              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-[var(--color-accent-teal)]/10 rounded-full">
                  <MdSchedule className="text-[var(--color-accent-teal)]" />
                </div>
                <span className="text-[var(--color-placeholder)]">
                  <span className="font-medium">Assigned:</span> {formatDate(assignment.createdAt)}
                </span>
              </div>

              {/* Due date */}
              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-red-500/10 rounded-full">
                  <MdAccessTime className="text-red-400" />
                </div>
                <span className="text-red-400">
                  <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {sortedAssignments.length === 0 && (
          <p className="text-[var(--color-text-light)] text-sm">No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default ClassAssignmentTimeline;
