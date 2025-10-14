import React from "react";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";

const ClassroomCard = ({ classroom }) => {

  return (
    <Link to={`/classroom/class/${classroom._id}`} className="group">
      <div
        className="
          bg-[var(--color-secondary)] rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.4)] 
          hover:shadow-[0_8px_25px_rgba(0,212,255,0.25)]
          border border-gray-800 hover:border-[#00d4ff]
          transition-all duration-300 ease-in-out transform hover:-translate-y-2
          flex flex-col cursor-pointer
        "
      >
        {/* ─── Image Banner ───────────────────────────── */}
        <div className="relative">
          <img
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            src={
              classroom.imageUrl ||
              "def"
            }
            alt={`${classroom.name} banner`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span
            className="
              absolute bottom-3 left-3 bg-gray-800/80 text-[#00d4ff] 
              text-xs font-bold font-ChakraPetch px-3 py-1 rounded-full backdrop-blur-sm
            "
          >
            {classroom.course}
          </span>
        </div>

        {/* ─── Content ───────────────────────────── */}
        <div className="p-5 flex flex-col flex-grow">
          <h3
            className="
              font-ChakraPetch text-xl font-bold text-white mb-2 
              group-hover:text-[#00d4ff] transition-colors duration-300
            "
          >
            {classroom.name}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {classroom.description || "No description available."}
          </p>

          {/* ─── Footer (Teacher + Members + Progress) ───────────────────────────── */}
          <div className="mt-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="text-[#00d4ff]" />
                <span>{classroom.professors?.length +" professor" || "Unknown Instructor"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BsPeopleFill className="text-[#00d4ff]" />
                <span>{classroom.students?.length || 0} students</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassroomCard;
