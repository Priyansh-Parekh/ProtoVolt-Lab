import React from 'react';
import { Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import Loading from '../helper/Loading';
import { FiPlus } from 'react-icons/fi';

const WorkspacePage = () => {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-sky-400">Personal Workspace</h1>
        
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg text-center">
            <h2 className="text-2xl mb-4">No recent projects</h2>
            <p className="text-gray-400 mb-6">Start a new document to begin your circuit design journey.</p>
           <Link to="/workspace/new" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-300 transform hover:scale-105">
              <FiPlus className="w-5 h-5" />
              <span>Start New Document</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/workspace/${project.id}`}
                  className="block p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{project.lastModified}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;