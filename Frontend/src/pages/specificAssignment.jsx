// src/pages/SpecificAssignment.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiPlus, FiChevronDown, FiUploadCloud, FiX } from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
import api from "../utils/axios"; // make sure this axios instance supports withCredentials

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
          <h3 className="text-xl font-semibold text-[var(--color-text-bright)] mb-4">
            {file.originalname || file.name || "Preview"}
          </h3>

          <div className="bg-[var(--color-primary)] rounded-md p-4">
            {isImage && <img src={file.url} alt={file.name} className="w-full h-auto rounded" />}
            {isPdf && (
              <iframe title={file.name} src={file.url} className="w-full h-[70vh] border-none" />
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
  const [subtabs, setSubtabs] = useState([]); // array of { _id, name, ... }
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [userFiles, setUserFiles] = useState([]); // local preview for user's uploads
  const [showSolution, setShowSolution] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Helper to safely extract attachments from different shapes
  const getProfessorAttachments = (a) => {
    if (!a) return [];
    if (Array.isArray(a)) return a;
    if (typeof a === "string") return [{ url: a, originalname: a }];
    if (typeof a === "object") return [a];
    return [];
  };

  // Format date helper
  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch {
      return d;
    }
  };

  // Fetch assignment from backend
  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    try {
      const res = await api.get("/classroom/data/getAssignment", {
        params: { _id: assignmentId },
        withCredentials: true,
      });

      if (res.data?.success) {
        const a = res.data.assignment;

        // Normalize subTabs — backend should populate them; otherwise map ids to default names
        const rawSubs = Array.isArray(a.subTabs) ? a.subTabs : [];
        const normalized = rawSubs.map((s, i) => {
          // s might be object or string id
          const name = s?.name || `subtab_${i + 1}`;
          return { _id: s?._id || s, name, circuit: s?.circuit || null };
        });

        setAssignment(a);
        setSubtabs(normalized);
      } else {
        // backend returned success:false
        console.warn("API returned no success:", res.data?.message);
        alert(res.data?.message || "Failed to fetch assignment");
      }
    } catch (err) {
      console.error("Failed to fetch assignment", err);
      alert("Server error while fetching assignment. See console.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  // Create a new subtab on server and append to local list
  const createSubtab = async (name) => {
    if (!assignmentId) return;
    setCreating(true);
    try {
      const body = { assignmentId, name };
      const res = await api.post("/classroom/data/createSubtab", body, { withCredentials: true });

      if (res.data?.success) {
        const subtab = res.data.subtab;
        // normalize name if backend didn't provide
        const normalized = { _id: subtab._id, name: subtab.name || name, ...subtab };
        setSubtabs((prev) => [...prev, normalized]);

        // navigate to workspace for this subtab
        navigate(`/classroom/${classroomId}/assignment/${assignmentId}/${normalized.name}/workspace`);
      } else {
        console.warn("createSubtab failed:", res.data?.message);
        alert(res.data?.message || "Failed to create subtab");
      }
    } catch (err) {
      console.error("createSubtab error:", err);
      alert("Server error while creating subtab");
    } finally {
      setCreating(false);
    }
  };

  // When user clicks Open Canvas - navigate to first subtab or create one
  const openCanvasToFirst = async () => {
    if (subtabs.length > 0) {
      navigate(`/classroom/${classroomId}/assignment/${assignmentId}/${subtabs[0].name}/workspace`);
      return;
    }
    // no subtabs -> create subtab_1
    const name = `subtab_1`;
    await createSubtab(name);
  };

  // Add a new subtab (naming: subtab_{n})
  const addNewSubtab = async () => {
    const name = `subtab_${subtabs.length + 1}`;
    await createSubtab(name);
  };

  // Handle user's uploaded file for preview (frontend only; backend integration later)
  const handleUserFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setUserFiles((prev) => [...prev, { originalname: file.name, url }]);

      // If you later want to POST file to backend, do so here with FormData and api.post
      // await api.post(`/classroom/data/${assignmentId}/upload`, formData, { withCredentials: true });
    } catch (err) {
      console.error("upload preview failed", err);
      alert("Failed to create local preview");
    } finally {
      setUploading(false);
    }
  };

  const removeUserFile = (idx) => setUserFiles((prev) => prev.filter((_, i) => i !== idx));

  // Preview professor file
  const openProfessorPreview = (file) => {
    // If backend attachment is string path, convert to { url }
    const f = typeof file === "string" ? { url: file, originalname: file } : file;
    setSelectedPreviewFile(f);
  };
  const closePreview = () => setSelectedPreviewFile(null);

  if (loading) {
    return <div className="p-6 text-[var(--color-text-light)]">Loading assignment...</div>;
  }

  // If no assignment loaded, fallback message
  if (!assignment) {
    return <div className="p-6 text-[var(--color-text-light)]">Assignment not found or you don't have access.</div>;
  }

  // professor attachments fallbacks
  const attachments =
    assignment.attachments ||
    (assignment.uploadedFile ? [assignment.uploadedFile] : null) ||
    assignment.uploadedFiles ||
    [];

  const profFiles = getProfessorAttachments(attachments);

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
                <strong>Due:</strong> {assignment.dueDate ? formatDate(assignment.dueDate) : "—"}
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
            {/* no Save Progress button on this page (canvas has Save) */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Professor Attachments */}
            <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
              <h3 className="text-xl text-[var(--color-text-bright)] font-semibold mb-3">Attached files</h3>

              {(!profFiles || profFiles.length === 0) ? (
                <div className="text-[var(--color-placeholder)]">No attachments provided.</div>
              ) : (
                <div className="space-y-2">
                  {profFiles.map((f, i) => {
                    const fileObj = typeof f === "string" ? { url: f, originalname: f } : f;
                    return (
                      <div key={i} className="flex items-center justify-between bg-[var(--color-primary)]/20 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 flex items-center justify-center rounded bg-[var(--color-border)] text-sm text-[var(--color-text-light)]">
                            {fileObj.type?.toUpperCase?.() || "FILE"}
                          </div>
                          <button onClick={() => openProfessorPreview(fileObj)} className="text-[var(--color-accent-cyan)] hover:underline text-left">
                            {fileObj.originalname || fileObj.name || fileObj.url}
                          </button>
                        </div>
                        <div className="text-[var(--color-placeholder)] text-xs">{fileObj.type || ""}</div>
                      </div>
                    );
                  })}
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
              {assignment.assignedApparatus && assignment.assignedApparatus.length > 0 ? (
                <ul className="list-disc list-inside text-[var(--color-text-light)] space-y-1">
                  {assignment.assignedApparatus.map((a, idx) => (
                    <li key={idx}>{a.type}{a.quantity ? ` — ${a.quantity}` : ""}</li>
                  ))}
                </ul>
              ) : assignment.apparatus && assignment.apparatus.length > 0 ? (
                <ul className="list-disc list-inside text-[var(--color-text-light)] space-y-1">
                  {assignment.apparatus.map((a, idx) => <li key={idx}>{a}</li>)}
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
                    disabled={creating}
                    className="p-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]"
                    title="Add new circuit tab"
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
                  onClick={() => setShowSolution((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-secondary)] text-[var(--color-text-light)]"
                >
                  <FiChevronDown className={`${showSolution ? "rotate-180 transform" : ""}`} />
                  View Solution Circuit
                </button>

                {showSolution && (
                  <div className="mt-3 bg-[var(--color-secondary)] p-4 rounded-md border border-[var(--color-border)]">
                    {assignment.solutionCircuit && assignment.solutionCircuit.length > 0 ? (
                      <div className="text-[var(--color-text-light)] space-y-3">
                        {assignment.solutionCircuit.map((c) => (
                          <div key={c._id || c} className="p-3 bg-[var(--color-primary)]/10 rounded">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-semibold text-[var(--color-accent-cyan)]">{c.name || "Solution Circuit"}</div>
                                <div className="text-sm text-[var(--color-placeholder)]">
                                  Uploaded by {c.owner?.name || "Professor"}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* open raw workspace view of circuit */}
                                <Link
                                  to={`/workspace/${c._id}`}
                                  className="px-3 py-1 rounded bg-[var(--color-accent-cyan)] text-black font-medium"
                                >
                                  Open
                                </Link>
                              </div>
                            </div>

                            {/* brief component list if available */}
                            {c.circuitdata?.components && c.circuitdata.components.length > 0 && (
                              <ul className="list-disc list-inside text-sm mt-2">
                                {c.circuitdata.components.map((comp, i) => (
                                  <li key={comp._id || i}>
                                    {comp.type} {comp.value ? `— ${comp.value}` : comp.voltage ? `— ${comp.voltage}` : ""}
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="text-sm mt-2">
                              Status:{" "}
                              <span className={c.analysed ? "text-green-400 font-semibold" : "text-yellow-400 font-semibold"}>
                                {c.analysed ? "Analysed" : "Pending Analysis"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[var(--color-placeholder)]">No solution available yet.</div>
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
                    <div key={i} className="flex items-center justify-between bg-[var(--color-primary)]/20 p-2 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--color-border)] flex items-center justify-center rounded text-[var(--color-text-light)]">
                          <BsFileEarmarkText />
                        </div>
                        <div className="truncate">{f.originalname}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => window.open(f.url, "_blank")} className="text-[var(--color-accent-cyan)] text-sm">
                          Preview
                        </button>
                        <button onClick={() => removeUserFile(i)} className="text-[var(--color-placeholder)] text-sm">
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

