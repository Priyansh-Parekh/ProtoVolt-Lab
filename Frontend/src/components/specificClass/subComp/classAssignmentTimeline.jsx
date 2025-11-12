import React from 'react';
import { MdAssignment, MdSchedule, MdPerson, MdAccessTime } from "react-icons/md";
import { Link } from "react-router-dom";

const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const options = { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true };
  return date.toLocaleDateString(undefined, options);
};

const ClassAssignmentTimeline = ({ classroomId, assignments = [] }) => {
  const sortedAssignments = [...assignments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="ClassAssignmentTimeline-container">
      <div className="ClassAssignmentTimeline-list space-y-5">
        {sortedAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="ClassAssignmentTimeline-card relative bg-[var(--color-secondary)] p-6 rounded-xl shadow-[var(--shadow-soft)] border border-[var(--color-accent-cyan)] hover:shadow-[var(--shadow-neon)] transition-all duration-300 w-full hover:scale-[1.02] group"
          >
            <div className="relative mb-4 pb-4 border-b border-[var(--color-border)]/30">
              <div className="absolute top-0 right-0 text-2xl">
                <MdAssignment className="text-[var(--color-accent-cyan)] group-hover:text-[var(--color-accent-teal)] transition-colors duration-300" />
              </div>
              <Link
                to={`/classroom/${classroomId}/assignment/${assignment._id}`}
                className="ClassAssignmentTimeline-title text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)] font-bold text-xl font-ChakraPetch pr-12 transition-colors duration-300"
              >
                {assignment.title}
              </Link>
            </div>

            <p className="text-sm text-[var(--color-text-light)] leading-relaxed mb-4">{assignment.description}</p>

            <div className="mb-4 p-3 bg-[var(--color-primary)]/50 rounded-lg border border-[var(--color-border)]/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-accent-cyan)]/10 rounded-full">
                  <MdPerson className="text-[var(--color-accent-cyan)] text-lg" />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-placeholder)] font-medium">Professor</p>
                  <p className="text-sm text-[var(--color-text-bright)] font-ChakraPetch">{assignment.professor.name || "Dr. Smith"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-[var(--color-accent-teal)]/10 rounded-full">
                  <MdSchedule className="text-[var(--color-accent-teal)]" />
                </div>
                <span className="text-[var(--color-placeholder)]">
                  <span className="font-medium">Assigned:</span> {formatDate(assignment.createdAt)}
                </span>
              </div>
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
