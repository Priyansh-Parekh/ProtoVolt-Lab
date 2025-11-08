// src/pages/SpecificAssignment.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiPlus, FiChevronDown, FiUploadCloud, FiX } from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
import api from "../utils/axios.js"; // make sure this axios instance supports withCredentials
import { error, info, success } from "../utils/toastify.js";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;
  const isImage = file.url && /\.(png|jpe?g|gif|webp)$/i.test(file.url);
  const isPdf = file.url && /\.pdf$/i.test(file.url);
  
  // Get display name without exposing URL
  const displayName = file.originalname || file.name || (file.url ? file.url.split('/').pop().split('?')[0] : 'Material File');

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div 
        className="bg-[var(--color-secondary)] rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[var(--color-secondary)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold text-[var(--color-text-bright)] truncate flex-1">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-md bg-[var(--color-accent-cyan)] text-black text-sm font-medium hover:opacity-90 transition-opacity"
              title="Download file"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="text-[var(--color-accent-cyan)] bg-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-border)] transition-colors"
              title="Close preview"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[var(--color-primary)] rounded-md p-4">
            {isImage && (
              <img 
                src={file.url} 
                alt={displayName} 
                className="w-full h-auto rounded"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              />
            )}
            {isPdf && (
              <iframe 
                title={displayName} 
                src={file.url} 
                className="w-full h-[70vh] border-none rounded"
                style={{ pointerEvents: 'auto' }}
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-[var(--color-text-light)] text-center py-8">
                <p className="mb-4">Preview not available for this file type.</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-md bg-[var(--color-accent-cyan)] text-black font-medium hover:opacity-90 transition-opacity"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecificAssignment = ({ user }) => {
  const { classroomId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [StudAssApi, setStudAssApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [studentWork, setStudentWork] = useState(null);
  const [subtabs, setSubtabs] = useState([]);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState(null);
  const [userFiles, setUserFiles] = useState([]); // local preview for user's uploads
  const [showSolution, setShowSolution] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showNewTabInput, setShowNewTabInput] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [isCreatingTab, setIsCreatingTab] = useState(false);

  // Helper to safely extract attachments from different shapes
  const getProfessorAttachments = (a) => {
    if (!a) return [];
    if (Array.isArray(a)) return a;
    if (typeof a === "string") {
      // Extract filename from URL if it's a URL, otherwise use as-is
      const fileName = a.split('/').pop().split('?')[0] || 'Material File';
      return [{ url: a, originalname: fileName, name: fileName }];
    }
    if (typeof a === "object") {
      // Ensure we don't expose URL in name field
      const fileName = a.originalname || a.name || (a.url ? a.url.split('/').pop().split('?')[0] : 'Material File');
      return [{ ...a, originalname: fileName, name: fileName }];
    }
    return [];
  };

  // Helper to extract filename from URL without exposing the URL
  const getFileName = (file) => {
    if (file.originalname) return file.originalname;
    if (file.name) return file.name;
    if (file.url) {
      // Extract just the filename from URL path
      const urlParts = file.url.split('/');
      return urlParts[urlParts.length - 1].split('?')[0] || 'Material File';
    }
    return 'Material File';
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
      const res = await api.get(`/classroom/data/getAssignment?_id=${assignmentId}`);

      if (res.data?.success) {
        const a = res.data.assignment;
        setAssignment(a);
      } else {
        // backend returned success:false
        console.warn("API returned no success:", res.data?.message);
        error(res.data?.message || "Failed to fetch assignment");
      }
    } catch (err) {
      error("Server error ");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  // Fetch student assignment data (only for students)
  useEffect(() => {
    if (user?.role === "student") {
      const fetchStudentAss = async () => {
        try {
          const res = await api.get(`/classroom/data/getStudAss?a_id=${assignmentId}`);
          if (res.data.success) {

            const newStudentWork = res.data.studentAssignment;

            setStudentWork(newStudentWork);

            if (newStudentWork && newStudentWork.subTabs) {
              setSubtabs(newStudentWork.subTabs);
            } else {
              setSubtabs([]);
            }

          } else {
            error(res.data.message);
          }
        } catch (err) {
          console.log(err);
          error("Server Error")
        }
      };

      fetchStudentAss();
    }
  }, [StudAssApi, assignmentId, user?.role]);
  // Create a new subtab on server and append to local list
  // Create a new subtab on server and append to local list
  const createSubtab = async () => {
    // 1. Validate the name
    const trimmedName = newTabName.trim();
    if (!trimmedName) {
      error("Please enter a circuit name");
      return;
    }

    setIsCreatingTab(true);

    try {
      const res = await api.post(`/classroom/data/createSubtab`, {
        ass_Id: assignmentId,
        name: trimmedName // 2. Send the name from state
      });

      if (res.data.success) {
        success(res.data.message);

        // 4. Reset and hide the input field
        setStudAssApi(prev => !prev);
        setNewTabName("");
        setShowNewTabInput(false);
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error("Server error ");
    } finally {
      setIsCreatingTab(false);
    }
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
              <h3 className="text-xl text-[var(--color-text-bright)] font-semibold mb-3">Assignment Materials</h3>

              {(!profFiles || profFiles.length === 0) ? (
                <div className="text-[var(--color-placeholder)]">No materials provided.</div>
              ) : (
                <div className="space-y-2">
                  {profFiles.map((f, i) => {
                    const fileObj = typeof f === "string" ? { url: f } : f;
                    const displayName = getFileName(fileObj);
                    // Extract file extension for icon/type display
                    const fileExtension = displayName.split('.').pop()?.toUpperCase() || 'FILE';
                    const fileType = fileObj.type || fileExtension;
                    
                    return (
                      <div key={i} className="flex items-center justify-between bg-[var(--color-primary)]/20 p-3 rounded hover:bg-[var(--color-primary)]/30 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-8 flex items-center justify-center rounded bg-[var(--color-border)] text-xs text-[var(--color-text-light)] flex-shrink-0">
                            {fileType.length > 4 ? fileType.substring(0, 4) : fileType}
                          </div>
                          <button 
                            onClick={() => openProfessorPreview(fileObj)} 
                            className="text-[var(--color-accent-cyan)] hover:underline text-left truncate flex-1"
                            title={`View ${displayName}`}
                          >
                            {displayName}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            // Open in new tab for download without exposing URL in UI
                            if (fileObj.url) {
                              const link = document.createElement('a');
                              link.href = fileObj.url;
                              link.target = '_blank';
                              link.rel = 'noopener noreferrer';
                              link.download = displayName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          className="text-[var(--color-placeholder)] hover:text-[var(--color-accent-cyan)] text-xs px-2 py-1 rounded transition-colors flex-shrink-0"
                          title="Download file"
                        >
                          Download
                        </button>
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

            {user.role === "student" && <>
              {/* Build Circuits (subtabs) */}
              <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[var(--color-text-bright)]">Build Circuits</h3>
                  <div className="flex items-center gap-2">
                    <button
                      // 1. onClick now shows the input field
                      onClick={() => setShowNewTabInput(true)}
                      // 2. Hide the '+' button if the input is already open
                      style={{ display: showNewTabInput ? 'none' : 'block' }}
                      className="p-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]"
                      title="Add new circuit tab"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* 3. NEW: This form appears when you click '+' */}
                {showNewTabInput && (
                  <div className="flex gap-2 mb-3 p-2 bg-[var(--color-primary)]/30 rounded-md">
                    <input
                      type="text"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      placeholder="New circuit name..."
                      className="flex-grow bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-cyan)] text-[var(--color-text-light)] px-1"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowNewTabInput(false);
                        setNewTabName("");
                      }}
                      className="p-1 text-[var(--color-placeholder)] hover:text-red-400"
                      title="Cancel"
                    >
                      <FiX />
                    </button>
                    <button
                      onClick={createSubtab}
                      disabled={isCreatingTab}
                      className="px-3 py-1 rounded bg-[var(--color-accent-cyan)] text-black font-medium disabled:opacity-50"
                    >
                      {isCreatingTab ? "Creating..." : "Create"}
                    </button>
                  </div>
                )}

                {/* 4. Your existing subtab list */}
                <div className="space-y-2">
                  {subtabs.length === 0 && !showNewTabInput && (
                    <div className="text-[var(--color-placeholder)]">No circuits yet. Click "+" to create one.</div>
                  )}
                  {subtabs.map((s) => (
                    <Link
                      key={s._id}
                      to={`/classroom/${classroomId}/assignment/${assignmentId}/${s._id}/${s.circuit}`}
                      className="block px-4 py-2 rounded-md bg-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] text-[var(--color-accent-cyan)]"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>}

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
                                Uploaded by {assignment.professor?.name || "Professor"}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* open raw workspace view of circuit */}
                              <Link
                                to={`/workspace/${c._id}?view=true`}
                                className="px-3 py-1 rounded bg-[var(--color-accent-cyan)] text-black font-medium"
                              >
                                Open
                              </Link>
                            </div>
                          </div>

                          {/* brief component list if available */}
                      

                          <div className="text-sm mt-2">
                            Status:{" "}
                            <span className={user._id===assignment.professor?._id ? "text-green-400 font-semibold" : "text-yellow-400 font-semibold"}>
                             {user._id===assignment.professor?._id ? "You will not be Able to Modify from here":"Read Only!"}
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

          {/* Right: student's work */}
          {user.role === "student" &&
            <aside className="space-y-4 lg:col-span-1">
              <div className="bg-[var(--color-secondary)] rounded-md p-4 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text-bright)] mb-3">Your work</h3>
                {studentWork?.completed ? <div className="text-sm text-green-400 mb-3">Handed in</div> : <div className="text-sm text-red-400 mb-3">Pending</div>}


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
          }
        </div>
      </div>
    </div>
  );
};

export default SpecificAssignment;

