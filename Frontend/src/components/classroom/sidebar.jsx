import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiChevronLeft, FiChevronRight,FiLayers } from "react-icons/fi";
import { BsBook } from "react-icons/bs";
import { motion } from "framer-motion";
import api from "../../utils/axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const activeId = params.get("id");

  // Fetch enrolled classrooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/user/data/getClassrooms");
        if (res.data.success) {
          setClassrooms(res.data.classrooms);
        }
      } catch (error) {
        console.error("Sidebar classroom fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  // Handle navigation when clicking a classroom
  const handleClassClick = (classId) => {
    navigate(`/classroom/class?id=${classId}`);
  };

  return (
    <motion.div
      initial={{ width: isOpen ? 260 : 80 }}
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className={`h-screen sticky top-0 bg-[var(--color-primary)] shadow-lg border-r border-[var(--color-border)] flex flex-col justify-between z-40`}
    >
      {/* Sidebar Content */}
      <div className="flex flex-col flex-grow">
        {/* Header / Toggle Button */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          {isOpen && (
            <h2 className="text-3xl font-semibold text-[var(--color-text-bright)] tracking-wide">
              Menu<span className="text-[var(--color-accent-cyan)]">Panel</span>
            </h2>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)] transition"
          >
            {isOpen ? <FiChevronLeft size={23} /> : <FiChevronRight size={36} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 flex flex-col space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent px-2">
          <Link
            to="/classroom"
            className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
              location.pathname === "/classroom"
                ? "bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]"
                : "hover:bg-[var(--color-primary)] hover:text-[var(--color-accent-cyan)] text-[var(--color-text-light)]"
            }`}
          >
            <FiHome size={20} />
            {isOpen && <span className="font-medium">My Classroom</span>}
          </Link>

          {/* Enrolled Classes Header */}
          <div className="flex items-center gap-3 py-2 px-3 mt-4 w-full  text-[var(--color-text-light)]">
            <FiLayers size={18} className="text-white flex-shrink-0" />
            {isOpen && (
              <span className="uppercase text-xs tracking-wider font-medium">
                Enrolled Classes
              </span>
            )}
          </div>

          {/* List of Enrolled Classes */}
          {classrooms.length > 0 ? (
            classrooms.map((cls) => (
              <motion.div
                key={cls._id}
                onClick={() => handleClassClick(cls._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeId === cls._id
                    ? "bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]"
                    : "hover:bg-[var(--color-primary)] hover:text-[var(--color-accent-cyan)] text-[var(--color-text-light)]"
                }`}
              >
                <BsBook size={18} className="text-white" />
                {isOpen && (
                  <span className="truncate font-medium">{cls.name}</span>
                )}
              </motion.div>
            ))
          ) : (
            isOpen && (
              <p className="text-[var(--color-placeholder)] text-sm px-3">
                No enrolled classes yet
              </p>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;