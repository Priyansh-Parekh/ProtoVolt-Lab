import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiPlus, FiChevronDown, FiUploadCloud, FiX } from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
import api from "../utils/axios"; // <-- keep for later; calls are commented out

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;
  const isImage = file.url && /\.(png|jpe?g|gif|webp)$/i.test(file.url);
  const isPdf = file.url && /\.pdf$/i.test(file.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[var(--color-secondary)] rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-accent-cyan)] bg-[var(--color-primary)] p-1 rounded-full"
        >
          <FiX />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-bright)] mb-4">{file.originalname || file.name}</h3>

          <div className="bg-[var(--color-primary)] rounded-md p-4">
            {isImage && <img src={file.url} alt={file.name} className="w-full h-auto rounded" />}
            {isPdf && (
              <iframe
                title={file.name}
                src={file.url}
                className="w-full h-[70vh] border-none"
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-[var(--color-text-light)]">
                Preview not available.{" "}
                <a href={file.url || "#"} target="_blank" rel="noreferrer" className="text-[var(--color-accent-cyan)]">
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecificAssignment = () => {
  const { classroomId, assignmentId, subtabSlug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [subtabs, setSubtabs] = useState([]); // { _id, name, _temp }
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [userFiles, setUserFiles] = useState([]); // files uploaded by user (preview only)
  const [showSolution, setShowSolution] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Local fallback assignment (shown if backend fetch is not enabled)
  const fallbackAssignment = {
    title: "Verification of Ohm's Law",
    description:
      "Students are required to verify Ohm's Law by connecting resistors in series and parallel using the given apparatus. Follow the steps and upload your report & circuit JSON.",
    dueDate: "25 Oct 2025, 11:30 pm",
    professor: { name: "Priyansh Parekh" },
    attachments: [],
    apparatus: ["Resistor", "Breadboard", "DC Source", "Connecting Wires"],
    uploadedFiles: [],
    //  backend structure for now:
  solutionCircuit: {
    _id: "circuit_ohmslaw_1",
    name: "Ohm's Law Verified Circuit",
    owner: {
      _id: "user_prof123",
      name: "Prof. Priyansh Parekh",
    },
    analysed: true,
    circuitdata: {
      components: [
        { _id: "comp1", type: "Resistor", value: "10Ω" },
        { _id: "comp2", type: "Resistor", value: "20Ω" },
        { _id: "comp3", type: "Battery", voltage: "5V" },
      ],
    },
  },
  };

  // fetch assignment - COMMENTED OUT for frontend testing
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        // ===== BACKEND: Uncomment when ready =====
        // const res = await api.get(`/classroom/${classroomId}/assignment/${assignmentId}`);
        // const data = res.data;
        // setAssignment(data);
        // setSubtabs((data.subTabs || []).map((s, i) => ({ _id: s._id, name: s.name || `subtab_${i+1}` })));
        // ========================================
        setAssignment(fallbackAssignment);
        setSubtabs([{ _id: `temp-${Date.now()}`, name: "subtab_1", _temp: true }]);
      } catch (err) {
        console.warn("Assignment fetch failed :", err);
        setAssignment(fallbackAssignment);
        setSubtabs([{ _id: `temp-${Date.now()}`, name: "subtab_1", _temp: true }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [classroomId, assignmentId]);

  // handle file uploads by user (preview-only)
  const handleUserFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setUserFiles((prev) => [...prev, { originalname: file.name, url }]);
      // ===== BACKEND: Upload when ready =====
      // const form = new FormData();
      // form.append("file", file);
      // await api.post(`/classroom/${classroomId}/assignment/${assignmentId}/upload`, form, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      // ========================================
    } catch (err) {
      console.error("File preview failed", err);
    } finally {
      setUploading(false);
    }
  };

  const removeUserFile = (idx) => setUserFiles((prev) => prev.filter((_, i) => i !== idx));

  const openProfessorPreview = (file) => setSelectedPreviewFile(file);
  const closePreview = () => setSelectedPreviewFile(null);

  // ✅ Updated navigation to Workspace page
  const openCanvasToFirst = () => {
    if (subtabs.length > 0) {
      const first = subtabs[0];
      navigate(`/classroom/${classroomId}/assignment/${assignmentId}/${first.name}/workspace`);
    } else {
      const name = `subtab_1`;
      const tmp = { _id: `temp-${Date.now()}`, name, _temp: true };
      setSubtabs([tmp]);
      navigate(`/classroom/${classroomId}/assignment/${assignmentId}/${name}/workspace`);
    }
  };

  const addNewSubtab = () => {
    const num = subtabs.length + 1;
    const name = `subtab_${num}`;
    const tmp = { _id: `temp-${Date.now()}`, name, _temp: true };
    setSubtabs((prev) => [...prev, tmp]);
    navigate(`/classroom/${classroomId}/assignment/${assignmentId}/${name}/workspace`);
  };

  const toggleSolution = () => setShowSolution((s) => !s);

  if (loading) {
    return <div className="p-6 text-[var(--color-text-light)]">Loading assignment preview...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary)] p-6">
      <FilePreviewModal file={selectedPreviewFile} onClose={closePreview} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">{assignment.title}</h1>
            <p className="text-sm text-[var(--color-placeholder)] mt-2">{assignment.description}</p>
            <div className="mt-3 text-sm text-[var(--color-text-light)]">
              <div>
                <strong>Professor:</strong> {assignment.professor?.name || "Professor"}
              </div>
              <div>
                <strong>Due:</strong> {assignment.dueDate || "—"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md bg-[var(--color-secondary)] text-[var(--color-text-light)]"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Professor Attachments */}
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h3 className="text-xl text-[var(--color-text-bright)] font-semibold mb-3">Attached files</h3>

              {(!assignment.attachments || assignment.attachments.length === 0) ? (
                <div className="text-[var(--color-placeholder)]">No attachments provided.</div>
              ) : (
                <div className="space-y-2">
                  {assignment.attachments.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-[var(--color-primary)]/20 p-3 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 flex items-center justify-center rounded bg-[var(--color-border)] text-sm text-[var(--color-text-light)]">
                          {f.type?.toUpperCase() || "FILE"}
                        </div>
                        <button onClick={() => openProfessorPreview(f)} className="text-[var(--color-accent-cyan)] hover:underline text-left">
                          {f.originalname || f.name}
                        </button>
                      </div>
                      <div className="text-[var(--color-placeholder)] text-xs">{f.type || ""}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-bright)] mb-2">Description</h3>
              <p className="text-[var(--color-text-light)] leading-relaxed">{assignment.description}</p>
            </div>

            {/* Apparatus */}
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-bright)] mb-2">Apparatus</h3>
              {assignment.apparatus && assignment.apparatus.length > 0 ? (
                <ul className="list-disc list-inside text-[var(--color-text-light)] space-y-1">
                  {assignment.apparatus.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-[var(--color-placeholder)]">No apparatus listed</div>
              )}
            </div>

            {/* Build Circuits (subtabs) */}
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[var(--color-text-bright)]">Build Circuits</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openCanvasToFirst}
                    className="px-3 py-1 rounded bg-[var(--color-accent-cyan)] text-black font-medium"
                  >
                    Open Canvas
                  </button>
                  <button
                    onClick={addNewSubtab}
                    className="p-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {subtabs.length === 0 && (
                  <div className="text-[var(--color-placeholder)]">No circuits yet. Click "New" to create one.</div>
                )}
                {subtabs.map((s) => (
                  <Link
                    key={s._id}
                    to={`/classroom/${classroomId}/assignment/${assignmentId}/${s.name}/workspace`}
                    className="block px-4 py-2 rounded-md bg-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] text-[var(--color-accent-cyan)]"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>

              {/* Solution toggle */}
              <div className="mt-4">
                <button
                  onClick={toggleSolution}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-secondary)] text-[var(--color-text-light)]"
                >
                  <FiChevronDown className={`${showSolution ? "rotate-180 transform" : ""}`} />
                  View Solution Circuit
                </button>

                {showSolution && (
                  <div className="mt-3 bg-[var(--color-secondary)] p-4 rounded-md border border-[var(--color-border)]">
                    {assignment.solutionCircuit ? (
                      <div className="text-[var(--color-text-light)] space-y-2">
                        <h4 className="text-lg font-semibold text-[var(--color-accent-cyan)]">
                          {assignment.solutionCircuit.name}
                        </h4>

                        <p className="text-sm text-[var(--color-placeholder)] italic">
                          Uploaded by {assignment.solutionCircuit.owner?.name || "Professor"}
                        </p>

                        <ul className="list-disc list-inside text-sm mt-2">
                          {assignment.solutionCircuit.circuitdata?.components?.map((comp, i) => (
                            <li key={comp._id || i}>
                              {comp.type} — {comp.value || comp.voltage || ""}
                            </li>
                          ))}
                        </ul>

                        <p className="text-sm mt-2">
                          Status:{" "}
                          <span
                            className={
                              assignment.solutionCircuit.analysed
                                ? "text-green-400 font-semibold"
                                : "text-yellow-400 font-semibold"
                            }
                          >
                            {assignment.solutionCircuit.analysed ? "Analysed" : "Pending Analysis"}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="text-[var(--color-placeholder)]">
                        No solution available yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: student's work */}
          <aside className="space-y-4">
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-bright)] mb-3">Your work</h3>
              <div className="text-sm text-red-400 mb-3">Missing</div>

              <label className="block cursor-pointer">
                <div className="border-dashed border-2 border-[var(--color-border)] rounded-md p-4 text-center hover:bg-[var(--color-primary)]/10">
                  <FiUploadCloud className="mx-auto text-2xl text-[var(--color-accent-cyan)] mb-2" />
                  <div className="text-[var(--color-text-light)]">Add or create</div>
                  <input type="file" className="sr-only" onChange={handleUserFile} />
                </div>
              </label>

              {uploading && <div className="mt-2 text-[var(--color-placeholder)]">Uploading preview...</div>}

              {userFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {userFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[var(--color-primary)]/20 p-2 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--color-border)] flex items-center justify-center rounded text-[var(--color-text-light)]">
                          <BsFileEarmarkText />
                        </div>
                        <div className="truncate">{f.originalname}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(f.url, "_blank")}
                          className="text-[var(--color-accent-cyan)] text-sm"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => removeUserFile(i)}
                          className="text-[var(--color-placeholder)] text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button className="mt-4 w-full px-4 py-2 rounded-md bg-[var(--color-accent-cyan)] text-black font-semibold">
                Mark as done
              </button>
            </div>

            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-medium text-[var(--color-text-bright)] mb-2">Private comments</h4>
              <div className="text-[var(--color-accent-cyan)] cursor-pointer">
                Add comment to {assignment.professor?.name}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SpecificAssignment;