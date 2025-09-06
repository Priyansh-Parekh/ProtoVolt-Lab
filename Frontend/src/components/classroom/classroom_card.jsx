import React from 'react';
import { Link } from 'react-router-dom';

const Classroom_card = ({ course }) => {
  return (
    // The entire card is a link to the specific course page
    <Link >
      <div 
        className="
          bg-[#1a1f2c] rounded-xl overflow-hidden shadow-lg h-full
          border border-gray-800 hover:border-[#00d4ff]
          group transition-all duration-300 ease-in-out
          transform hover:-translate-y-2 flex flex-col
        "
      >
        {/* Course Image */}
        <img 
          className="w-full h-48 object-cover" 
          src={course.imageUrl} 
          alt={`${course.title} banner`} 
        />

        {/* Course Content - flex-grow makes this section fill available space */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-ChakraPetch text-2xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            {course.description}
          </p>

          {/* Progress Bar - Pushed to the bottom */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium font-ChakraPetch text-gray-300">Progress</span>
              <span className="text-sm font-medium font-ChakraPetch text-gray-300">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-[#00d4ff] h-2.5 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Classroom_card;