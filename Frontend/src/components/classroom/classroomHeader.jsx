import React from 'react'
import { FiPlus, FiLogIn } from 'react-icons/fi'; // Import icons

const Classroom_header = ({setJoinPopup, setCreatePopup}) => {
    return (

        <header
            className="
      bg-transparent
      h-30
      flex flex-col md:flex-row
      md:justify-between
      md:items-center
      gap-6 md:gap-4
      animate-fadeIn              /* NEW: Gentle fade-in animation on load */
    "
        >
            {/* Left Side: Title and Subtitle */}
            <div>
                <h1
                    className="
            pl-10
            pb-3
            font-ChakraPetch text-4xl lg:text-5xl font-bold 
            bg-gradient-to-r from-[#a855f7] to-[#00d4ff] /* NEW: Gradient on hover */
            bg-clip-text text-transparent                     /* NEW: Makes gradient show through text */
            transition-all duration-300 ease-in-out
            "
                >
                    My Classroom
                </h1>
                <p className="
        pl-80
    font-serif italic                        /* NEW Font Style */
    text-lg text-stone-200                  /* NEW Color */
    mt-4
    animate-float
    opacity-90
    transition-all duration-700 ease-in-out
  ">
                    Your <span className="text-amber-500 font-semibold not-italic">learning journey</span> continues here.
                </p>

            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">

                {/* Secondary Action Button */}
                <button
                    onClick={() => setJoinPopup(prev => !prev)}
                    className="
            font-ChakraPetch font-semibold text-[#00d4ff]
            border border-[#00d4ff] rounded-lg
            px-4 sm:px-5 py-2.5
            transition-all duration-300
            hover:bg-[#00d4ff] hover:text-[var(--color-tertiary)]
            focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50
            flex items-center gap-2         /* NEW: For aligning icon and text */
            "
                >
                    <FiLogIn className="h-5 w-5" /> {/* NEW: Icon */}
                    <span>Join a Class</span>
                </button>

                {/* Primary Action Button */}
                <button
                    onClick={() => setCreatePopup(prev => !prev)}
                    className="
                    mr-3
            font-ChakraPetch font-bold text-[var(--color-tertiary)]
            bg-[#00d4ff] rounded-lg
            px-4 sm:px-5 py-2.5
            transition-all duration-300
            hover:bg-[#00b8e6]
            focus:outline-none focus:ring-2 focus:ring-[#00d4ff]
            flex items-center gap-2           /* NEW: For aligning icon and text */
            hover:shadow-lg hover:shadow-[#00d4ff]/30 /* NEW: Subtle glow on hover */
            transform hover:-translate-y-1    /* NEW: Slight lift on hover */
            "
                >
                    <FiPlus className="h-5 w-5" />   {/* NEW: Icon */}
                    <span>Create Class</span>
                </button>
            </div>
        </header>
    )
}

export default Classroom_header