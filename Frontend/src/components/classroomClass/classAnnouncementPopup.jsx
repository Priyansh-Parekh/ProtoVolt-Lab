import React from "react";
import { IoMegaphoneSharp } from "react-icons/io5";
import { FaTimes, FaUpload, FaPaperPlane } from "react-icons/fa";

const ClassAnnouncement = ({setAnnounced}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-[#1a1f2c] shadow-lg rounded-2xl p-6 border border-[#2e3345] relative animate-fadeIn">

        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors" onClick={()=> setAnnounced(prev => !prev)} >
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
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-white cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/40 transform transition-all duration-300">
                <FaUpload size={16} />
                <span>Choose File</span>
                <input type="file" className="hidden" />
              </label>
              <span className="text-gray-400 text-sm italic">No file chosen</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-3">

            <button
            onClick={()=> setAnnounced(prev => !prev)}
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#a855f7] via-[#7e22ce] to-[#4c1d95] text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-[#a855f7]/40 transform transition-all duration-300"
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
