import React from 'react'
import { FaPlusCircle } from "react-icons/fa";       // New Assignment Icon
import { IoMegaphoneSharp } from "react-icons/io5"; // New Announcement Icon
import { FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom';

//components


const ClassHeader = ({setAssigned,setAnnounced}) => {

    let id =1;//temp



    return (
        <header
            className="
            border-b border-gray-700
      bg-transparent
      h-auto
      flex flex-col md:flex-row
      md:justify-between
      md:items-center
      gap-6 md:gap-4
      px-6
      pt-6
      mb-3
      animate-fadeIn
    "
        >
            {/* Left Side: Title + Subtitle */}
            <div>
                <h1
                    className=" 
          font-ChakraPetch text-4xl lg:text-5xl font-bold 
          bg-gradient-to-r from-[#a855f7] to-[#00d4ff]
          bg-clip-text text-transparent
          transition-all duration-300 ease-in-out
        "
                >
                    My Classroom
                </h1>
                <p
                    className="
          font-serif italic
          text-lg text-stone-200
          mt-3
          animate-float
          opacity-90
          transition-all duration-700 ease-in-out
        "
                >
                    Your{" "}
                    <span className="text-amber-500 font-semibold not-italic">
                        learning journey
                    </span>{" "}
                    continues here.
                </p>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">

                {/* New Assignment Button */}
                <button
                onClick={()=> setAssigned(prev => !prev)}
                    className=" 
          flex items-center gap-2
          font-ChakraPetch font-semibold
          bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]
          text-[var(--color-tertiary)]
          px-4 sm:px-5 py-2.5
          rounded-lg
          transition-all duration-300
          hover:scale-105 hover:shadow-lg hover:shadow-[#00d4ff]/30
          transform hover:-translate-y-1
        "
                >
                    <FaPlusCircle className="h-5 w-5" />
                    <span>New Assignment</span>
                </button>

                {/* New Announcement Button */}
                <button
                onClick={()=> setAnnounced(prev => !prev)}
                    className="
     flex items-center gap-2
          font-ChakraPetch font-semibold
          border border-[#00d4ff]
          text-[#00d4ff]
          px-4 sm:px-5 py-2.5
          rounded-lg
          transition-all duration-300
          hover:bg-[#00d4ff] hover:text-[var(--color-tertiary)]
          focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50
          hover:shadow-lg hover:shadow-[#00d4ff]/30
          transform hover:-translate-y-1
  "
                >
                    <IoMegaphoneSharp className="h-5 w-5" />
                    <span>New Announcement</span>
                </button>

                {/* View Members Button */}
                
                <Link  to={`members`}
                    className="
          flex items-center gap-2
          font-ChakraPetch font-semibold
          border border-[#00d4ff]
          text-[#00d4ff]
          px-4 sm:px-5 py-2.5
          rounded-lg
          transition-all duration-300
          hover:bg-[#00d4ff] hover:text-[var(--color-tertiary)]
          focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50
          hover:shadow-lg hover:shadow-[#00d4ff]/30
          transform hover:-translate-y-1
        "
                >
                    <FaUsers className="h-5 w-5" />
                    <span>View Members</span>
                </Link>
            </div>
        </header>
    )
}

export default ClassHeader