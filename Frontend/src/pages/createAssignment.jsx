import React, { useState, useEffect, useMemo } from "react";
// 1. Make sure useNavigate is imported
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch, FiPaperclip, FiX, FiCheckCircle, FiChevronRight, FiCircle, FiEdit3,
  FiCpu, FiPlus, FiMinus, FiList, FiTool, FiSend, FiInfo,
} from "react-icons/fi";
import { FaMicrochip, FaBolt, FaWaveSquare, FaProjectDiagram } from "react-icons/fa";

//importing utils
import api from "../utils/axios.js";
import { error, success, warning } from "../utils/toastify.js";

const initialApparatusState = [
  { name: "Resistor", type: "analog", required: false, quantity: 1, icon: <FaProjectDiagram /> },
  { name: "Capacitor", type: "analog", required: false, quantity: 1, icon: <FiMinus className="rotate-90" /> },
  { name: "Inductor", type: "analog", required: false, quantity: 1, icon: <FaWaveSquare /> },
  { name: "DC Source", type: "analog", required: false, quantity: 1, icon: <FaBolt /> },
  { name: "AC Source", type: "analog", required: false, quantity: 1, icon: <FaWaveSquare /> },
  { name: "Ground", type: "analog", required: false, quantity: 1, icon: <FiMinus className="rotate-90" /> },
  { name: "Transistor (NPN)", type: "analog", required: false, quantity: 1, icon: <FaProjectDiagram /> },
  { name: "AND Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
  { name: "OR Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
  { name: "NOT Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
  { name: "XOR Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
  { name: "NAND Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
  { name: "NOR Gate", type: "digital", required: false, quantity: 1, icon: <FaMicrochip /> },
];

// --- Sub-Components (No changes needed here) ---
const SolutionCircuitCard = ({ circuit, isSelected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${isSelected
                ? "bg-[var(--color-primary)] border-[var(--color-accent-cyan)] shadow-lg"
                : "bg-[var(--color-tertiary)] border-transparent hover:border-[var(--color-border)]"
            }`}
    >
        <div className="flex items-center space-x-4">
            {isSelected ? <FiCheckCircle className="text-[var(--color-accent-cyan)] w-5 h-5 flex-shrink-0" /> : <FiCircle className="text-[var(--color-placeholder)] w-5 h-5 flex-shrink-0" />}
            <div>
                <h3 className="font-bold text-md text-[var(--color-text-bright)]">{circuit.name}</h3>
                <div className="text-xs text-[var(--color-placeholder)] mt-1"><span> {circuit.circuitdata.components.length} Components</span></div>
            </div>
        </div>
        <Link to={`/workspace/${circuit._id}`} onClick={(e) => e.stopPropagation()} className="text-sm font-medium text-[var(--color-accent-cyan)] hover:underline flex items-center">
            View <FiChevronRight className="w-4 h-4 ml-1" />
        </Link>
    </div>
);

const ApparatusCard = ({ item, onToggle, onQuantityChange }) => (
    <div
        onClick={onToggle}
        className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 ${item.required ? 'bg-[var(--color-primary)] border-[var(--color-accent-cyan)]' : 'bg-[var(--color-tertiary)] border-transparent hover:border-[var(--color-border)]'}`}
    >
        <div className={`text-2xl ${item.required ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-placeholder)]'}`}>{item.icon}</div>
        <span className="text-sm font-medium text-[var(--color-text-bright)] leading-tight">{item.name}</span>
        {item.required && (
            <div className="flex items-center space-x-2 pt-1" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => onQuantityChange(item.name, item.quantity - 1)} className="p-1 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-border)]"><FiMinus size={12} /></button>
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.name, parseInt(e.target.value, 10))}
                    className="custom-input w-12 text-center p-1 rounded-md text-xs bg-[var(--color-secondary)]"
                />
                <button type="button" onClick={() => onQuantityChange(item.name, item.quantity + 1)} className="p-1 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-border)]"><FiPlus size={12} /></button>
            </div>
        )}
    </div>
);

// --- Main Component ---
const CreateAssignment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState(null);
    const [apparatus, setApparatus] = useState(initialApparatusState);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCircuits, setSelectedCircuits] = useState([]);
    const [availableCircuits, setAvailableCircuits] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 2. ADD LOADING STATE

    const { C_id } = location.state || {};

    // 3. COMBINED AND CORRECTED useEffect
    useEffect(() => {
        // Guard Clause: Check for C_id first.
        if (!C_id) {
            error("Classroom ID not found. Redirecting...");
            navigate("/dashboard"); // Or your preferred redirect path
            return; // Stop the effect here.
        }

        // Data Fetching: Only runs if C_id exists.
        const fetchData = async () => {
            try {
                const res = await api.get("/user/data/getCircuits");
                if (res.data.success) {
                    setAvailableCircuits(res.data.circuits);
                } else {
                    error(res.data.message);
                }
            } catch (err) {
                error(err.message);
            } finally {
                setIsLoading(false); // Set loading to false after fetch completes
            }
        };

        fetchData();
    }, [C_id, navigate]); // Dependencies for the effect

    const handleApparatusToggle = (itemName) => {
        setApparatus((prev) => prev.map((item) => item.name === itemName ? { ...item, required: !item.required } : item));
    };

    const handleQuantityChange = (itemName, quantity) => {
        setApparatus((prev) => prev.map((item) => item.name === itemName ? { ...item, quantity: Math.max(1, parseInt(quantity, 10) || 1) } : item));
    };

    const handleCircuitSelect = (circuitId) => {
        setSelectedCircuits((prev) => prev.includes(circuitId) ? prev.filter((id) => id !== circuitId) : [...prev, circuitId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!C_id) {
            error("Cannot submit: Classroom ID is missing.");
            return;
        }
        setIsSubmitting(true);
        try {
            const dataAssign = new FormData();
            dataAssign.append("title", title);
            dataAssign.append("description", description);
            dataAssign.append("dueDate", dueDate);
            dataAssign.append("classroomId", C_id);
            if (file) {
                dataAssign.append("file", file);
            }
            const assignedApparatus = apparatus
                .filter(item => item.required)
                .map(item => ({ type: item.name, quantity: item.quantity }));
            dataAssign.append("assignedApparatus", JSON.stringify(assignedApparatus));
            dataAssign.append("solutionCircuit", JSON.stringify(selectedCircuits));
            if (!file) {
                warning("You haven't set the Material for Assignment");
            }
            const res = await api.post("/classroom/data/createAssignment", dataAssign, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                success(res.data.message);
                navigate(`/classroom/class?id=${C_id}`); // Redirect to classroom on success
            } else {
                error(res.data.message);
            }
        } catch (err) {
            console.error(`❌ Error uploading assignment`, err);
            error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCircuits = useMemo(() =>
        availableCircuits.filter((circuit) => circuit.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [availableCircuits, searchTerm]
    );
    const selectedCircuitObjects = useMemo(() =>
        availableCircuits.filter(c => selectedCircuits.includes(c._id)),
        [availableCircuits, selectedCircuits]
    );
    const requiredApparatus = useMemo(() => apparatus.filter(a => a.required), [apparatus]);
    const isFormValid = title && description && dueDate;

    // 4. ADD EARLY RETURN FOR REDIRECT
    if (!C_id) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary)] text-[var(--color-text-bright)]">
                <p className="text-xl">Invalid page access. Redirecting...</p>
            </div>
        );
    }

  return (
    <>
      <style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /* Track (background area of scrollbar) */
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--color-secondary);
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  }

  /* Scrollbar thumb (the draggable part) */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      var(--color-accent-cyan),
      var(--color-accent-teal),
      var(--color-accent-green)
    );
    border-radius: 10px;
    border: 2px solid var(--color-primary);
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
    transition: all 0.3s ease-in-out;
  }

  /* On hover — brighter, glowing effect */
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      var(--color-accent-green),
      var(--color-accent-cyan)
    );
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
  }

  /* Scrollbar corner (when both scrolls appear) */
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: var(--color-primary);
  }
`}</style>

      <div className="text-[var(--color-text-light)] min-h-screen flex flex-col items-center p-4 sm:p-6 bg-[var(--color-primary)]">
        <div className="w-full max-w-7xl text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-bright)]">
            Create a New <span className="text-[var(--color-accent-cyan)]">Assignment</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- Main Content Area --- */}
            <main className="lg:w-2/3 w-full space-y-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              {/* Section 1: Basic Details */}
              <section className="bg-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border)] space-y-6">
                <h2 className="flex items-center text-xl font-bold text-[var(--color-text-bright)] gap-3"><FiEdit3 />Assignment Details</h2>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Assignment Title</label>
                  <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Lab 3: RLC Circuit Analysis" className="custom-input w-full p-3 rounded-md text-sm" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Provide instructions, learning objectives..." className="custom-input w-full p-3 rounded-md text-sm" />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="custom-input w-full p-3 rounded-md text-sm" min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Attach Files (Optional)</label>
                  {!file ? (
                    <label htmlFor="uploadedFiles" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer bg-[var(--color-primary)] hover:bg-[var(--color-tertiary)] transition-colors">
                      <div className="flex flex-col items-center justify-center"><FiPaperclip className="w-6 h-6 mb-2 text-[var(--color-placeholder)]" /><p className="text-sm text-[var(--color-placeholder)]"><span className="font-semibold">Click to upload</span></p></div>
                      <input id="uploadedFiles" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between w-full p-3 rounded-md bg-[var(--color-primary)] border border-[var(--color-border)]">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <button type="button" onClick={() => setFile(null)} className="text-[var(--color-placeholder)] hover:text-[var(--color-text-bright)]"><FiX className="w-5 h-5" /></button>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 2: Apparatus Required */}
              <section className="bg-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                <h2 className="flex items-center text-xl font-bold text-[var(--color-text-bright)] gap-3 mb-6"><FiTool />Apparatus Required</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {apparatus.map(item => (
                    <ApparatusCard key={item.name} item={item} onToggle={() => handleApparatusToggle(item.name)} onQuantityChange={handleQuantityChange} />
                  ))}
                </div>
              </section>

              {/* Section 3: Select Solution Circuits */}
              <section className="bg-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col h-[70vh]">
                                <h2 className="flex items-center text-xl font-bold text-[var(--color-text-bright)] gap-3 mb-1"><FiCpu />Select Solution Circuits</h2>
                                <p className="text-sm mb-4">Choose one or more circuits to serve as official solutions.</p>
                                <div className="relative mb-4">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-placeholder)]" />
                                    <input type="text" placeholder="Search circuits by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="custom-input w-full p-3 pl-10 rounded-md text-sm" />
                                </div>
                                <div className="flex-grow overflow-y-auto custom-scrollbar -mr-4 pr-4 space-y-3">
                                    {/* 5. IMPLEMENT CONDITIONAL RENDERING */}
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p className="text-[var(--color-placeholder)]">Loading circuits...</p>
                                            {/* For a better UX, you could map over a few <SkeletonCard /> components here */}
                                        </div>
                                    ) : (
                                        filteredCircuits.length > 0 ? (
                                            filteredCircuits.map(circuit => (
                                                <SolutionCircuitCard
                                                    key={circuit._id}
                                                    circuit={circuit}
                                                    isSelected={selectedCircuits.includes(circuit._id)}
                                                    onSelect={() => handleCircuitSelect(circuit._id)}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-center text-[var(--color-placeholder)] mt-12">No circuits found.</p>
                                        )
                                    )}
                                </div>
                            </section>
            </main>

            {/* --- Sticky Sidebar --- */}
            <aside className="lg:w-1/3 w-full lg:sticky top-6 h-fit animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <div className="bg-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border)] space-y-6">
                <h2 className="flex items-center text-xl font-bold text-[var(--color-text-bright)] gap-3"><FiInfo />Assignment Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Title:</span><span className="font-bold text-right truncate">{title || "Not set"}</span></div>
                  <div className="flex justify-between"><span>Due Date:</span><span className="font-bold">{dueDate || "Not set"}</span></div>
                </div>
                <hr className="border-[var(--color-border)]" />

                <div>
                  <h3 className="font-bold text-md text-[var(--color-text-bright)] mb-3">Selected Solutions ({selectedCircuitObjects.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {selectedCircuitObjects.length > 0 ? selectedCircuitObjects.map(c => (
                      <div key={c._id} className="text-sm flex justify-between items-center bg-[var(--color-primary)] p-2 rounded-md">
                        <span className="truncate">{c.name}</span>
                        <button type="button" onClick={() => handleCircuitSelect(c._id)} className="text-[var(--color-placeholder)] hover:text-red-500 ml-2"><FiX /></button>
                      </div>
                    )) : <p className="text-xs text-center text-[var(--color-placeholder)]">No solution circuits selected.</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-md text-[var(--color-text-bright)] mb-3">Required Apparatus ({requiredApparatus.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {requiredApparatus.length > 0 ? requiredApparatus.map(a => (
                      <div key={a.name} className="text-sm flex justify-between items-center bg-[var(--color-primary)] p-2 rounded-md">
                        <span>{a.name}</span>
                        <span className="font-bold text-[var(--color-accent-cyan)]">x{a.quantity}</span>
                      </div>
                    )) : <p className="text-xs text-center text-[var(--color-placeholder)]">No apparatus required.</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full py-3.5 rounded-md hover:cursor-pointer text-md font-bold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-neon)' }}
                >
                  <FiSend />
                  {isSubmitting ? "Publishing..." : "Publish Assignment"}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAssignment;