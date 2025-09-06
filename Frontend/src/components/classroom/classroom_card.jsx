import React from 'react';
import { Link } from 'react-router-dom';

// Renamed to ClassroomCard for standard React naming conventions
const ClassroomCard = ({ classroom }) => {
  // Placeholder for progress, as this would typically be calculated
  const progress = 45; 

  return (
    // The entire card links to the specific classroom page using `classroom._id`
    <Link to={`/classroom/class/${classroom._id}`}>
      <div 
        className="
          bg-[#1a1f2c] rounded-xl overflow-hidden shadow-lg h-full
          border border-gray-800 hover:border-[#00d4ff]
          group transition-all duration-300 ease-in-out
          transform hover:-translate-y-2 flex flex-col
        "
      >
        {/* Classroom Image - Using a placeholder since imageUrl is not in the seed */}
        <img 
          className="w-full h-48 object-cover" 
          // Provides a default image if `classroom.imageUrl` is not present
          src={classroom.imageUrl || 'https://source.unsplash.com/random/600x400?technology,circuit'} 
          alt={`${classroom.name} banner`} 
        />

        {/* Classroom Content - flex-grow makes this section fill available space */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-ChakraPetch text-2xl font-bold text-white group-hover:text-[#00d4ff] transition-colors duration-300">
              {/* Using `classroom.name` for the title */}
              {classroom.name}
            </h3>
            <span className="bg-gray-700 text-[#00d4ff] text-xs font-bold font-ChakraPetch px-2.5 py-1 rounded-full">
              {/* Added the course code from `classroom.course` */}
              {classroom.course}
            </span>
          </div>
          
          <p className="text-gray-400 text-base mb-6 flex-grow">
            {/* Using `classroom.description` */}
            {classroom.description}
          </p>

          {/* Progress Bar - Pushed to the bottom */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium font-ChakraPetch text-gray-300">Progress</span>
              {/* Using the placeholder progress value */}
              <span className="text-sm font-medium font-ChakraPetch text-gray-300">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-[#00d4ff] h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassroomCard;