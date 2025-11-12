import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiPlus,
  FiChevronDown,
  FiUploadCloud,
  FiX,
  FiBookOpen,
  FiFileText,
  FiTool,
  FiUser,
  FiCpu
} from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
import api from "../utils/axios.js";
import { error, info, success } from "../utils/toastify.js";
import Sidebar from '../components/classroom/sidebar.jsx';

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;
  const isImage = file.url && /\.(png|jpe?g|gif|webp)$/i.test(file.url);
  const isPdf = file.url && /\.pdf$/i.test(file.url);

  const displayName =
    file.originalname ||
    file.name ||
    (file.url ? file.url.split("/").pop().split("?")[0] : "Material File");

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative border border-cyan-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-cyan-500/40 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold text-gray-100 truncate flex-1 font-[Chakra_Petch]">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-medium hover:opacity-90 transition-all"
              title="Download file"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="text-cyan-400 bg-gray-900 p-2 rounded-full hover:bg-cyan-500/20 transition-colors"
              title="Close preview"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-900 rounded-lg p-4">
            {isImage && (
              <img
                src={file.url}
                alt={displayName}
                className="w-full h-auto rounded"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: "none", userSelect: "none" }}
              />
            )}
            {isPdf && (
              <iframe
                title={displayName}
                src={file.url}
                className="w-full h-[70vh] border-none rounded"
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-gray-400 text-center py-8">
                <p className="mb-4">Preview not available for this file type.</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-medium hover:opacity-90 transition-opacity"
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
  const [userFiles, setUserFiles] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showNewTabInput, setShowNewTabInput] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [isCreatingTab, setIsCreatingTab] = useState(false);

  const getProfessorAttachments = (a) => {
    if (!a) return [];
    if (Array.isArray(a)) return a;
    if (typeof a === "string") {
      const fileName = a.split("/").pop().split("?")[0] || "Material File";
      return [{ url: a, originalname: fileName, name: fileName }];
    }
    if (typeof a === "object") {
      const fileName =
        a.originalname ||
        a.name ||
        (a.url ? a.url.split("/").pop().split("?")[0] : "Material File");
      return [{ ...a, originalname: fileName, name: fileName }];
    }
    return [];
  };

  const getFileName = (file) => {
    if (file.originalname) return file.originalname;
    if (file.name) return file.name;
    if (file.url) {
      const urlParts = file.url.split("/");
      return urlParts[urlParts.length - 1].split("?")[0] || "Material File";
    }
    return "Material File";
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch {
      return d;
    }
  };

  const fetchAssignment = useCallback(async () => {
    if (!assignmentId) return;
    setLoading(true);
    try {
      const res = await api.get(`/classroom/data/getAssignment?_id=${assignmentId}`);
      if (res.data?.success) setAssignment(res.data.assignment);
      else error(res.data?.message || "Failed to fetch assignment");
    } catch {
      error("Server error");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

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
           // setSubtabs(newStudentWork?.subTabs || []);
          } else error(res.data.message);
        } catch (err){
           console.log(err);
          error("Server Error");
        }
      };
      fetchStudentAss();
    }
  }, [StudAssApi, assignmentId, user?.role]);

  const createSubtab = async () => {
    const trimmedName = newTabName.trim();
    if (!trimmedName) return error("Please enter a circuit name");
    setIsCreatingTab(true);
    try {
      const res = await api.post(`/classroom/data/createSubtab`, {
        ass_Id: assignmentId,
        name: trimmedName,
      });
      if (res.data.success) {
        success(res.data.message);
        setStudAssApi(prev => !prev);
        setNewTabName("");
        setShowNewTabInput(false);
      } else error(res.data.message);
    } catch {
      error("Server error");
    } finally {
      setIsCreatingTab(false);
    }
  };

  const handleUserFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setUserFiles((prev) => [...prev, { originalname: file.name, url }]);
    } finally {
      setUploading(false);
    }
  };

  const removeUserFile = (idx) =>
    setUserFiles((prev) => prev.filter((_, i) => i !== idx));

  const openProfessorPreview = (file) => {
    const f = typeof file === "string" ? { url: file, originalname: file } : file;
    setSelectedPreviewFile(f);
  };

  const closePreview = () => setSelectedPreviewFile(null);

  if (loading)
    return (
      <div className="p-6 text-gray-400 font-[Chakra_Petch] bg-gray-900 min-h-screen flex items-center justify-center">
        Loading assignment...
      </div>
    );

  if (!assignment)
    return (
      <div className="p-6 text-gray-400 font-[Chakra_Petch] bg-gray-900 min-h-screen flex items-center justify-center">
        Assignment not found or you don't have access.
      </div>
    );

  const attachments =
    assignment.attachments ||
    (assignment.uploadedFile ? [assignment.uploadedFile] : null) ||
    assignment.uploadedFiles ||
    [];

  const profFiles = getProfessorAttachments(attachments);

  return (
    <div className="flex min-h-screen bg-[var(--color-primary)] font-[Chakra_Petch] text-gray-300">
       <Sidebar />

        <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
          <div className={`w-full max-w-6xl ${user.role === 'professor' ? 'mx-auto' : ''}`}>
      <FilePreviewModal file={selectedPreviewFile} onClose={closePreview} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {assignment.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">{assignment.description}</p>
            <div className="mt-3 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <FiUser className="text-cyan-400" /> <strong>Professor:</strong>{" "}
                {assignment.professor?.name || "Professor"}
              </div>
              <div className="flex items-center gap-2">
                <FiBookOpen className="text-cyan-400" /> <strong>Due:</strong>{" "}
                {assignment.dueDate ? formatDate(assignment.dueDate) : "—"}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow-md hover:shadow-cyan-500/30 transition-all"
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Assignment Materials */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-md hover:shadow-cyan-500/20">
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <FiFileText /> Assignment Materials
              </h3>
              {(!profFiles || profFiles.length === 0) ? (
                <div className="text-gray-500">No materials provided.</div>
              ) : (
                <div className="space-y-2">
                  {profFiles.map((f, i) => {
                    const fileObj = typeof f === "string" ? { url: f } : f;
                    const displayName = getFileName(fileObj);
                    const fileType =
                      displayName.split(".").pop()?.toUpperCase() || "FILE";
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg hover:bg-gray-900/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-8 flex items-center justify-center rounded bg-cyan-400/10 border border-cyan-400/20 text-xs text-cyan-400">
                            {fileType}
                          </div>
                          <button
                            onClick={() => openProfessorPreview(fileObj)}
                            className="text-cyan-400 hover:underline truncate flex-1 text-left"
                          >
                            {displayName}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (fileObj.url) {
                              const link = document.createElement("a");
                              link.href = fileObj.url;
                              link.target = "_blank";
                              link.rel = "noopener noreferrer";
                              link.download = displayName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          className="text-gray-500 hover:text-cyan-400 text-xs px-2 py-1 rounded transition-colors"
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
            <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-md hover:shadow-cyan-500/20">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <FiFileText /> Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {assignment.description}
              </p>
            </div>

            {/* Apparatus */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-md hover:shadow-cyan-500/20">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <FiTool /> Apparatus
              </h3>
              {assignment.assignedApparatus?.length ? (
                <ul className="list-disc list-inside space-y-1">
                  {assignment.assignedApparatus.map((a, idx) => (
                    <li key={idx}>
                      {a.type}
                      {a.quantity ? ` — ${a.quantity}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No apparatus listed.</div>
              )}
            </div>



            {user.role === "student" && (
            <>
              {/* Build Circuits (subtabs) */}
              <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-md hover:shadow-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
                    <FiCpu /> Build Circuits
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      // 1. onClick now shows the input field
                      onClick={() => setShowNewTabInput(true)}
                      // 2. Hide the '+' button if the input is already open
                      style={{ display: showNewTabInput ? "none" : "block" }}
                      className="p-2 rounded bg-transparent border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 transition-all"
                      title="Add new circuit tab"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* 3. NEW: This form appears when you click '+' */}
                {showNewTabInput && (
                  <div className="flex gap-2 mb-3 p-2 bg-gray-700/50 rounded-md border border-cyan-500/30">
                    <input
                      type="text"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      placeholder="New circuit name..."
                      className="flex-grow bg-transparent border-b border-cyan-500/30 focus:outline-none focus:border-cyan-400 text-gray-200 px-1"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowNewTabInput(false);
                        setNewTabName("");
                      }}
                      className="p-1 text-gray-400 hover:text-red-400"
                      title="Cancel"
                    >
                      <FiX />
                    </button>
                    <button
                      onClick={createSubtab}
                      disabled={isCreatingTab}
                      className="px-3 py-1 rounded bg-cyan-400 text-black font-medium hover:bg-cyan-300 disabled:opacity-50"
                    >
                      {isCreatingTab ? "Creating..." : "Create"}
                    </button>
                  </div>
                )}

                {/* 4. Your existing subtab list */}
                <div className="space-y-2">
                  {subtabs.length === 0 && !showNewTabInput && (
                    <div className="text-gray-400">
                      No circuits yet. Click "+" to create one.
                    </div>
                  )}
                  {subtabs.map((s) => (
                    <Link
                      key={s._id}
                      to={`/classroom/${classroomId}/assignment/${assignmentId}/${s._id}/${s.circuit}`}
                      className="block px-4 py-2 rounded-md bg-gray-700/50 hover:bg-gray-700 border border-transparent hover:border-cyan-400/30 text-cyan-400 transition-all"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}


            {/* Solution Toggle */}
            <div>
              <button
                onClick={() => setShowSolution((s) => !s)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 border border-cyan-400/30 hover:border-cyan-400/50 transition-all"
              >
                <FiChevronDown
                  className={`${showSolution ? "rotate-180 transform" : ""}`}
                />
                View Solution Circuit
              </button>
              {showSolution && (
                <div className="mt-3 bg-gray-800 p-4 rounded-md border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
                  {assignment.solutionCircuit?.length ? (
                    assignment.solutionCircuit.map((c) => (
                      <div
                        key={c._id || c}
                        className="p-3 bg-gray-900/30 rounded mb-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-cyan-400">
                              {c.name || "Solution Circuit"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Uploaded by {assignment.professor?.name || "Professor"}
                            </div>
                          </div>
                          <Link
                            to={`/workspace/${c._id}?view=true`}
                            className="px-3 py-1 rounded bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-medium hover:opacity-90"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No solution available yet.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          {user.role === "student" && (
            <aside className="space-y-4 lg:col-span-1">
              <div className="bg-gray-800 rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-400/50 transition-all shadow-md hover:shadow-cyan-500/20">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <FiUploadCloud /> Your Work
                </h3>
                {studentWork?.completed ? (
                  <div className="text-sm text-green-400 mb-3">Handed in</div>
                ) : (
                  <div className="text-sm text-red-400 mb-3">Pending</div>
                )}

                <label className="block cursor-pointer">
                  <div className="border-dashed border-2 border-cyan-400/30 rounded-md p-4 text-center hover:border-cyan-400/60 transition-all">
                    <input
                      type="file"
                      onChange={handleUserFile}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center text-cyan-400">
                      <FiUploadCloud size={24} />
                      <span className="text-sm mt-1">
                        {uploading ? "Uploading..." : "Upload your file"}
                      </span>
                    </div>
                  </div>
                </label>

                <div className="mt-3 space-y-2">
                  {userFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-900/40 p-2 rounded-md hover:bg-gray-900/60 transition-all"
                    >
                      <span className="truncate">{file.originalname}</span>
                      <button
                        onClick={() => removeUserFile(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={createSubtab}
                  disabled={isCreatingTab}
                  className="mt-4 w-full px-3 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:opacity-90 transition-all"
                >
                  {isCreatingTab ? "Creating..." : "Create Circuit"}
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SpecificAssignment;

