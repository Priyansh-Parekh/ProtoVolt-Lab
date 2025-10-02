import React from 'react';
import { assignmentSeed } from '../../../seeds/data';
import { AiOutlineFile, AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";

// Helper function to format dates consistently
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const ClassAssignmentTimeline = () => {
  // Sort assignments by creation date, newest first
  const sortedAssignments = [...assignmentSeed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="ClassAssignmentTimeline-container">
      <h2 className="ClassAssignmentTimeline-header text-[var(--color-text-bright)] text-3xl font-bold mb-6 font-ChakraPetch">
        📚 Assignments
      </h2>
      <div className="ClassAssignmentTimeline-list space-y-5">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="ClassAssignmentTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-lg shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition w-full border border-transparent hover:border-[var(--color-accent-cyan)]"
          >
            {/* Top-right type icon */}
            <div className="ClassAssignmentTimeline-icon-wrapper absolute top-4 right-4 text-xl">
              <AiOutlineFile
                className="ClassAssignmentTimeline-icon text-[var(--color-accent-cyan)]"
                title="Assignment"
              />
            </div>

            {/* Title - It's a link to the specific assignment page */}
            <Link
              to={`/assignments/${assignment._id}`}
              className="ClassAssignmentTimeline-title text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)] font-bold text-xl font-ChakraPetch"
            >
              {assignment.title}
            </Link>

            {/* Description */}
            <p className="ClassAssignmentTimeline-description text-sm mt-3 text-[var(--color-text-light)]">{assignment.description}</p>

            {/* Date info */}
            <div className="ClassAssignmentTimeline-date-wrapper-assigned flex items-center gap-2 mt-4 text-xs text-[var(--color-placeholder)]">
              <AiOutlineCalendar className="ClassAssignmentTimeline-date-icon-assigned" />
              <span className="ClassAssignmentTimeline-date-text-assigned">
                Assigned: {formatDate(assignment.createdAt)}
              </span>
            </div>
             <div className="ClassAssignmentTimeline-date-wrapper-due flex items-center gap-2 mt-2 text-xs text-red-400">
              <AiOutlineCalendar className="ClassAssignmentTimeline-date-icon-due" />
              <span className="ClassAssignmentTimeline-date-text-due">
                Due: {formatDate(assignment.dueDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassAssignmentTimeline;

