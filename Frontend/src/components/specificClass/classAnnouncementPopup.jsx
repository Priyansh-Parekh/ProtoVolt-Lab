import React,{useState, useRef} from "react";
import { IoMegaphoneSharp } from "react-icons/io5";
import { FaTimes, FaUpload, FaPaperPlane, FaTrash } from "react-icons/fa";

import api from "../../utils/axios";
import { success, error, info } from "../../utils/toastify";


const ClassAnnouncement = ({ setAnnounced, c_id ,setCallAnnounApi}) => {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  // Supported file types
  const supportedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
  const supportedVideoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp', 'ogv', 'mpg', 'mpeg'];
  const supportedRawTypes = ['pdf', 'zip', 'docx', 'txt', 'json', 'csv'];
  
  const allSupportedTypes = [...supportedImageTypes, ...supportedVideoTypes, ...supportedRawTypes];

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setFileError("");
      return true;
    }

    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allSupportedTypes.includes(fileExtension)) {
      setFileError(`File type not supported. Supported formats: Images (${supportedImageTypes.join(', ')}), Videos (${supportedVideoTypes.join(', ')}), Raw (${supportedRawTypes.join(', ')})`);
      return false;
    }

    setFileError("");
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null);
      e.target.value = ""; // Reset file input
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReselectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate file before submission
    if (file && !validateFile(file)) {
      error("Please select a valid file type");
      return;
    }

    e.target.disable = true;
    e.target.style.opacity = 0.5;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      info("Creating announcement...");
      const res = await api.post(`/classroom/data/createAnnouncement?c_id=${c_id}`, formData);
      if (res.data.success) {
        success(res.data.message);
        setTitle("");
        setContent("");
        setFile(null);
        setFileError("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setAnnounced(prev => !prev);
        setCallAnnounApi(prev => !prev);
      } else {
        error(res.data.message);
      }
      e.target.disable = false;
      e.target.style.opacity = 1;
    } catch (err) {
      console.error("API error:", err);
      error("Something went wrong");
      e.target.disable = false;
      e.target.style.opacity = 1;
    }
  }


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto py-8 scrollbar-hide">
      <div className="w-full max-w-4xl bg-[#1a1f2c] shadow-lg rounded-2xl p-6 border border-[#2e3345] relative animate-fadeIn my-8 max-h-[90vh] overflow-y-auto scrollbar-hide">

        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors" 
          onClick={() => {
            setTitle("");
            setContent("");
            setFile(null);
            setFileError("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setAnnounced(prev => !prev);
          }}
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#7e22ce]">
            <IoMegaphoneSharp className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold font-ChakraPetch text-white tracking-wide">
            New Announcement
          </h2>
        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Announcement Title */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Title
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter announcement title"
              className="w-full px-4 py-2 rounded-lg bg-[#0a0e17] border border-[#2e3345] text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>

          {/* Announcement Description */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Description
            </label>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              placeholder="Enter announcement details..."
              className="w-full px-4 py-2 rounded-lg bg-[#0a0e17] border border-[#2e3345] text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7] transition-colors"
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Attach File <span className="text-sm text-gray-400">(Optional)</span>
            </label>
            <div className="space-y-2">
              {/* Hidden file input */}
              <input 
                id="file-input"
                ref={fileInputRef}
                onChange={handleFileChange} 
                type="file" 
                className="hidden" 
              />
              
              <div className="flex items-center gap-3 flex-wrap">
                {!file ? (
                  <>
                    <label 
                      htmlFor="file-input"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-white cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/40 transform transition-all duration-300"
                    >
                      <FaUpload size={16} />
                      <span>Choose File</span>
                    </label>
                    <span className="text-sm italic text-gray-400">
                      No file chosen
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-3 w-full p-3 bg-[#0a0e17] rounded-lg border border-[#2e3345]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReselectFile}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[#2e3345] text-gray-300 hover:bg-[#3a4050] hover:text-white transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                        title="Remove file"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Supported formats info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-400">Supported formats:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#0a0e17] rounded border border-[#2e3345]">
                    <span className="text-[#a855f7]">Images:</span> {supportedImageTypes.join(', ')}
                  </span>
                  <span className="px-2 py-1 bg-[#0a0e17] rounded border border-[#2e3345]">
                    <span className="text-[#a855f7]">Videos:</span> {supportedVideoTypes.join(', ')}
                  </span>
                  <span className="px-2 py-1 bg-[#0a0e17] rounded border border-[#2e3345]">
                    <span className="text-[#a855f7]">Raw:</span> {supportedRawTypes.join(', ')}
                  </span>
                </div>
              </div>

              {/* Error message */}
              {fileError && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-xs text-red-400 break-words">{fileError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-3">

            <button
              onClick={(e) => {handleSubmit(e)}}
              type="submit"
              disabled={!!fileError}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] via-[#7e22ce] to-[#4c1d95] text-white font-semibold transform transition-all duration-300 ${
                fileError 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/40"
              }`}
            >
              <FaPaperPlane size={14} />
              Announce
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassAnnouncement;
