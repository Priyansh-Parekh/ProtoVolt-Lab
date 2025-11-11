import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiActivity,
  FiZap,
  FiDatabase,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import { error, success } from "../utils/toastify.js";
import api from "../utils/axios.js";

const WorkspacePage = ({ user }) => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(user?true:false);
  const [deleteCircuit, setDeleteCircuit] = useState(false);

  if (user) {

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await api.get("/user/data/getCircuits");
          if (res.data.success) setCircuits(res.data.circuits);
          else error(res.data.message);
        } catch (err) {
          error("Failed to fetch circuits");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [deleteCircuit]);

  }
 
  

  const handleDelete = async (e, id) => {
    e.target.disabled = true;
    e.target.style.opacity = 0.5;
    try {
      const res = await api.post('/circuit/data/deleteCircuit', { id })
      if (res.data.success) {
        success("Deleted that Circuit");
      } else {
        error("Failed to delete Circuit");
      }
    } catch (err) {
      error("server Error");
    } finally {
      e.target.disabled = false;
      e.target.style.opacity = 1;
      setDeleteCircuit(!deleteCircuit);
    }
  }

  // ---------- LOADING SCREEN ----------
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-primary)] text-white">
        <div className="w-14 h-14 border-4 border-t-[var(--color-accent-cyan)] border-gray-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-[var(--color-text-light)]">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-primary)] text-white pt-16 px-6 overflow-hidden">
      {/* --- Background Glow --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent-cyan)_0%,transparent_60%)] opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-[var(--color-accent-purple)] opacity-10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[var(--color-accent-green)] opacity-10 blur-[150px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10 animate-fadeIn">

        {/* ---------- CASE 1: NO PROJECTS YET ---------- */}
        {circuits.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-28">
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] p-10 rounded-3xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition-all max-w-xl animate-fadeIn">
              <FiZap
                size={55}
                className="text-[var(--color-accent-cyan)] mx-auto mb-4 animate-float"
              />
              <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-[var(--gradient-primary)]">
                Welcome to ProtoVolt Lab ⚡
              </h1>
              <p className="text-[var(--color-text-light)] leading-relaxed mb-6">
                You currently have no projects. Begin your journey by creating
                your first circuit workspace — experiment, design, and simulate
                ideas with real-time results.
              </p>
              <Link
                to="/workspace/new"
                className="inline-flex items-center gap-2 bg-[var(--color-accent-cyan)] text-black px-6 py-2.5 rounded-xl font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] hover:opacity-90 transition"
              >
                <FiPlus size={20} /> Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ---------- HEADER ---------- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[var(--gradient-primary)]">
                  Your Circuits
                </h1>
                <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-relaxed">
                  <span className="text-[var(--color-accent-cyan)] font-semibold">Craft</span>,{" "}
                  <span className="text-[var(--color-accent-green)] font-semibold">simulate</span>, and{" "}
                  <span className="text-[var(--color-accent-purple)] font-semibold">optimize</span>{" "}
                  <span className="text-[var(--color-accent-teal)] font-semibold">circuits</span> ⚡. <br />
                  Turn ideas into <span className="text-[var(--color-accent-indigo)] font-semibold">interactive labs</span>!
                </p>


              </div>

            </div>

            {/* ---------- DASHBOARD STATS ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {/* Total Projects */}
              <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center gap-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition">
                <FiDatabase className="text-[var(--color-accent-teal)]" size={30} />
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">
                    Total Projects
                  </p>
                  <h2 className="text-xl font-semibold text-[var(--color-text-bright)]">
                    {circuits.length}
                  </h2>
                </div>
              </div>

              {/* Projects Created Recently (last 7 days) */}
              <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center gap-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition">
                <FiZap className="text-[var(--color-accent-green)]" size={30} />
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">
                    Projects This Week
                  </p>
                  <h2 className="text-xl font-semibold text-[var(--color-text-bright)]">
                    {
                      circuits.filter(c => {
                        const created = new Date(c.createdAt);
                        const now = new Date();
                        const diff = (now - created) / (1000 * 60 * 60 * 24); // difference in days
                        return diff <= 7;
                      }).length
                    }
                  </h2>
                </div>
              </div>

              {/* Oldest Project */}
              <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center gap-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-neon)] transition">
                <FiActivity className="text-[var(--color-accent-purple)]" size={30} />
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">
                    Oldest Project
                  </p>
                  <h2 className="text-xl font-semibold text-[var(--color-text-bright)]">
                    {circuits.length > 0
                      ? circuits.reduce((oldest, c) =>
                        new Date(c.createdAt) < new Date(oldest.createdAt) ? c : oldest
                      ).name || "Untitled"
                      : "-"}
                  </h2>
                </div>
              </div>
            </div>

            {/* ---------- RECENT PROJECTS SECTION ---------- */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[var(--color-text-bright)]">
                Recently Created
              </h2>
              <div className="h-[1px] flex-1 ml-4 bg-[var(--color-border)]"></div>
            </div>

            {/* ---------- PROJECT GRID ---------- */}

            <div
              className={`grid ${circuits.length === 1 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                } gap-6 pb-20`}
            >
              {(
                <div className="bg-[var(--color-tertiary)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-center items-center opacity-70 hover:opacity-90 transition">
                  <FiPlus size={35} className="text-[var(--color-accent-cyan)] mb-3" />
                  <p className="text-sm text-[var(--color-text-light)] text-center">
                    Want more circuits?
                    <br /> Create a new project now.
                  </p>
                  <Link
                    to="/workspace/new"
                    className="mt-3 px-4 py-2 bg-[var(--color-accent-cyan)] text-black rounded-lg font-semibold hover:shadow-[var(--shadow-neon)] transition"
                  >
                    New Project
                  </Link>
                </div>
              )}

              {circuits.map((circuit, index) => (
                <div
                  key={circuit._id}
                  className="relative bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-accent-cyan)] hover:shadow-[var(--shadow-neon)] transition-all transform hover:-translate-y-1 animate-fadeIn flex flex-col justify-between"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent Link click
                      e.preventDefault();
                      handleDelete(e, circuit._id);
                    }}
                    className="absolute top-3 hover:cursor-pointer right-3 text-[var(--color-placeholder)] hover:text-red-500 transition-all"
                    title="Delete circuit"
                  >
                    <FiTrash2 size={18} />
                  </button>

                  {/* Clickable Link Area */}
                  <Link
                    to={`/workspace/${circuit._id}`}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <FiActivity
                          size={24}
                          className="text-[var(--color-accent-purple)]"
                        />
                        <span className="text-xs m-[10px] text-[var(--color-placeholder)]">
                          {new Date(circuit.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-1">
                        {circuit.name || "Untitled Circuit"}
                      </h2>
                      <p className="text-sm text-[var(--color-text-light)]">
                        Click to open this circuit
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end text-[var(--color-accent-cyan)] items-center gap-1 text-sm font-medium">
                      Open <FiChevronRight size={14} />
                    </div>
                  </Link>
                </div>
              ))}



            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
